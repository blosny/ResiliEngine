import { HttpException, HttpStatus } from '@nestjs/common';
import { IChaosStrategy } from './chaos.strategy.interface';

export class HttpErrorStrategy implements IChaosStrategy {
  name = 'Internal Server Error Injection';

  async execute(): Promise<void> {
    console.log(`[Chaos] 500 Internal Server Error fırlatılıyor...`);
    throw new HttpException(
      'Chaos Engine: Yapay hata enjekte edildi!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
