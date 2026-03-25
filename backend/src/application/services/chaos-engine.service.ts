import { Injectable, Inject, Logger, HttpException } from '@nestjs/common';
import { IChaosStrategy } from '../../domain/strategies/chaos.strategy.interface';
// TS1272 Çözümü: Interface'i 'import type' olarak alıyoruz
import type { IChaosRepository } from '../../domain/interfaces/chaos-repository.interface';
import { AiServiceClient } from '../../infrastructure/external/ai-service.client';

@Injectable()
export class ChaosEngineService {
  private readonly logger = new Logger(ChaosEngineService.name);
  private strategy?: IChaosStrategy;

  constructor(
    @Inject('IChaosRepository')
    private readonly chaosRepository: IChaosRepository,
    private readonly aiClient: AiServiceClient,
  ) {}

  /**
   * Stratejiyi dinamik olarak değiştirmemizi sağlar (Strategy Pattern).
   */
  setStrategy(strategy: IChaosStrategy) {
    this.logger.log(`Strateji atandı: ${strategy.name}`);
    this.strategy = strategy;
  }

  /**
   * STAGE 4: Geçmiş kaos deneylerini ve AI analizlerini veritabanından getirir.
   */
  async getHistory() {
    this.logger.log('Kaos geçmişi veritabanından çekiliyor...');
    return await this.chaosRepository.findAll();
  }

  /**
   * STAGE 4 GÖREVİ: Deneyi çalıştıran ana metod.
   * Taha'nın testlerde beklediği isim: executeStrategy
   */
  async executeStrategy(config: { target: string; params?: any }) {
    if (!this.strategy) {
      this.logger.warn('Çalıştırılacak bir strateji seçilmedi!');
      throw new HttpException('No chaos strategy selected', 400);
    }

    const startTime = Date.now();
    let status = 'SUCCESS';
    let errorDetails = '';

    try {
      this.logger.log(
        `[Chaos Engine] Deney Başlıyor: ${this.strategy.name} -> Hedef: ${config.target}`,
      );

      // Hata enjeksiyonunu gerçekleştir
      await this.strategy.execute(config.params);
    } catch (err: unknown) {
      // TS18046 Çözümü: Unknown error tipini yönetiyoruz
      status = 'FAILED';
      errorDetails = err instanceof Error ? err.message : String(err);

      this.logger.error(`[Chaos Engine] Hata Enjekte Edildi: ${errorDetails}`);
      // Testlerin (Jest) hatayı yakalayabilmesi için tekrar fırlatıyoruz
      throw err;
    } finally {
      const duration = Date.now() - startTime;

      try {
        // 1. Veritabanına Log Kaydet (Repository Pattern)
        const log = await this.chaosRepository.createLog({
          type: this.strategy.name,
          target: config.target,
          status,
          duration,
          errorDetails,
        });

        // 2. SCRUM-11: Tunahan'ın AI Servisine Gönder
        await this.aiClient.sendLogForAnalysis({
          experimentId: log.id,
          type: log.type,
          target: log.target,
          status: log.status,
          metrics: { duration },
          timestamp: log.timestamp,
        });
      } catch (internalErr) {
        this.logger.error('Loglama veya AI servisi hatası:', internalErr);
      }
    }
  }
}
