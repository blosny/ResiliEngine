import { Injectable } from '@nestjs/common';
import { IChaosStrategy } from '../../domain/strategies/chaos.strategy.interface';

@Injectable()
export class ChaosEngineService {
  // Hatayı çözmek için '?' ekledik (optional). Başlangıçta boş olabilir dedik.
  private strategy?: IChaosStrategy;

  setStrategy(strategy: IChaosStrategy) {
    this.strategy = strategy;
  }

  async run() {
    // Burada zaten kontrol ettiğimiz için hata almayız
    if (!this.strategy) {
      console.log('[Chaos Engine] Çalıştırılacak bir strateji seçilmedi.');
      return;
    }
    await this.strategy.execute();
  }
}