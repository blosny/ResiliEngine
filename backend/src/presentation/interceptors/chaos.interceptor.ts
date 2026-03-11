import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChaosEngineService } from '../../application/services/chaos-engine.service';
import { LatencyStrategy } from '../../domain/strategies/latency.strategy';
import { HttpErrorStrategy } from '../../domain/strategies/http-error.strategy';

@Injectable()
export class ChaosInterceptor implements NestInterceptor {
  constructor(private readonly chaosEngine: ChaosEngineService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // Kaos ihtimali (Örn: %30 ihtimalle hata enjekte et)
    const shouldInjectFault = Math.random() < 0.3;

    if (shouldInjectFault) {
      // Rastgele bir strateji seçelim
      const randomValue = Math.random();
      if (randomValue < 0.5) {
        this.chaosEngine.setStrategy(new LatencyStrategy(3000)); // 3 saniye gecikme
      } else {
        this.chaosEngine.setStrategy(new HttpErrorStrategy()); // 500 Hatası
      }

      console.log('[Chaos Interceptor] Dikkat! Sisteme hata enjekte ediliyor...');
      await this.chaosEngine.run();
    }

    return next.handle();
  }
}