import { Injectable, Inject, Logger } from '@nestjs/common';
import { IChaosStrategy } from '../../domain/strategies/chaos.strategy.interface';
// HATA 1 ÇÖZÜMÜ: Interface'i 'import type' olarak içeri alıyoruz (TS1272 hatası için)
import type { IChaosRepository } from '../../domain/interfaces/chaos-repository.interface';
import { AiServiceClient } from '../../infrastructure/external/ai-service.client';

@Injectable()
export class ChaosEngineService {
  private readonly logger = new Logger(ChaosEngineService.name);
  private strategy?: IChaosStrategy;

  constructor(
    // Token olarak 'IChaosRepository' kullanmaya devam ediyoruz, tip olarak interface
    @Inject('IChaosRepository')
    private readonly chaosRepository: IChaosRepository,
    private readonly aiClient: AiServiceClient,
  ) {}

  setStrategy(strategy: IChaosStrategy) {
    this.strategy = strategy;
  }

  async run(config: { target: string; params?: any }) {
    if (!this.strategy)
      return { success: false, message: 'No strategy selected' };

    const startTime = Date.now();
    let status = 'SUCCESS';
    let errorDetails = '';

    try {
      await this.strategy.execute(config.params);
    } catch (err: unknown) {
      // HATA 2 ÇÖZÜMÜ: 'err' unknown olduğu için tip kontrolü yapıyoruz (TS18046)
      status = 'FAILED';
      if (err instanceof Error) {
        errorDetails = err.message;
      } else {
        errorDetails = String(err);
      }
      throw err;
    } finally {
      const duration = Date.now() - startTime;

      try {
        const log = await this.chaosRepository.createLog({
          type: this.strategy.name,
          target: config.target,
          status,
          duration,
          errorDetails,
        });

        await this.aiClient.sendLogForAnalysis({
          experimentId: log.id,
          type: log.type,
          status: log.status,
          metrics: { duration },
        });
      } catch (logErr) {
        this.logger.error(
          'Logging or AI delivery failed',
          logErr instanceof Error ? logErr.message : String(logErr),
        );
      }
    }
  }
}
