import { Test, TestingModule } from '@nestjs/testing';
import { ChaosEngineService } from './chaos-engine.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AiServiceClient } from '../../infrastructure/external/ai-service.client';

describe('ChaosEngineService Unit Test (Stage 4 - SCRUM-14)', () => {
  let service: ChaosEngineService;
  let mockRepository: any;
  let mockAiClient: any;

  beforeEach(async () => {
    // 1. Mock nesneleri oluşturuluyor
    mockRepository = {
      createLog: jest.fn().mockResolvedValue({
        id: '123',
        type: 'LATENCY',
        target: 'test',
        status: 'SUCCESS',
        timestamp: new Date(),
      }),
      findAll: jest.fn().mockResolvedValue([]),
    };

    mockAiClient = {
      sendLogForAnalysis: jest.fn().mockResolvedValue(true),
    };

    // 2. Test modülü kuruluyor
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChaosEngineService,
        { provide: 'IChaosRepository', useValue: mockRepository },
        { provide: AiServiceClient, useValue: mockAiClient },
      ],
    }).compile();

    service = module.get<ChaosEngineService>(ChaosEngineService);
  });

  // FACT: Strateji seçilmeme durumu
  it('strateji seçilmediğinde hata fırlatmalı (Fact)', async () => {
    await expect(
      service.executeStrategy({ target: 'test-service' }),
    ).rejects.toThrow();
  });

  // THEORY: Farklı strateji türleri için başarı testi (Hocanın istediği it.each yapısı)
  it.each([
    { type: 'LATENCY', target: 'payment-service' },
    { type: 'ERROR_500', target: 'auth-service' },
  ])(
    'Strateji başarıyla koşturulmalı ve loglanmalı: %p (Theory)',
    async (scenario) => {
      const mockStrategy = {
        name: scenario.type,
        execute: jest.fn().mockResolvedValue(undefined),
      };

      service.setStrategy(mockStrategy as any);
      await service.executeStrategy({ target: scenario.target });

      // Hem DB'ye yazıldığını hem AI'ya istek atıldığını doğrula
      expect(mockRepository.createLog).toHaveBeenCalled();
      expect(mockAiClient.sendLogForAnalysis).toHaveBeenCalled();
    },
  );

  // SCRUM-14 ÖZEL: AI Servisi kapalıyken Backend çökmemeli (Resilience Test)
  it('AI servisine ulaşılamadığında Backend çökmemeli (Resilience Check)', async () => {
    const mockStrategy = {
      name: 'LATENCY',
      execute: jest.fn().mockResolvedValue(undefined),
    };

    service.setStrategy(mockStrategy as any);

    // AI servisi hata fırlatacak (servis kapalı simülasyonu)
    mockAiClient.sendLogForAnalysis.mockRejectedValue(
      new Error('AI Service Down'),
    );

    // AI hatasına rağmen executeStrategy metodu çökmemeli (resolves)
    await expect(
      service.executeStrategy({ target: 'resilience-test' }),
    ).resolves.not.toThrow();

    // AI kopsa bile deney logunun veritabanına yine de yazıldığını doğrula
    expect(mockRepository.createLog).toHaveBeenCalledWith(
      expect.objectContaining({
        target: 'resilience-test',
        status: 'SUCCESS',
      }),
    );
  });
});
