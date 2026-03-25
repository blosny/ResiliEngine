import { Test, TestingModule } from '@nestjs/testing';
import { ChaosEngineService } from './chaos-engine.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AiServiceClient } from '../../infrastructure/external/ai-service.client'; // AiServiceClient'ı import et

describe('ChaosEngineService Unit Test', () => {
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
        { provide: AiServiceClient, useValue: mockAiClient }, // HATA BURADAYDI: String yerine Class verdik
      ],
    }).compile();

    service = module.get<ChaosEngineService>(ChaosEngineService);
  });

  it('Hata stratejisi tetiklendiğinde hatayı fırlatmalı', async () => {
    const mockErrorStrategy: any = {
      name: 'ERROR_500',
      execute: jest
        .fn()
        .mockRejectedValue(
          new HttpException('Fail', HttpStatus.INTERNAL_SERVER_ERROR),
        ),
    };

    service.setStrategy(mockErrorStrategy);

    // executeStrategy metodunun hata fırlattığını kontrol et
    await expect(
      service.executeStrategy({ target: 'test-service' }),
    ).rejects.toThrow();
  });

  it('Gecikme stratejisi başarıyla tamamlanmalı', async () => {
    const mockLatencyStrategy: any = {
      name: 'LATENCY',
      execute: jest.fn().mockResolvedValue(undefined),
    };

    service.setStrategy(mockLatencyStrategy);
    await service.executeStrategy({ target: 'test-service' });

    // DB'ye kayıt atılıp atılmadığını kontrol et
    expect(mockRepository.createLog).toHaveBeenCalled();
  });
});
