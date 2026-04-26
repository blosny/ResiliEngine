import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IChaosStrategy } from '../../domain/strategies/chaos.strategy.interface';

@Injectable()
export class Error429Strategy implements IChaosStrategy {
  name = 'Rate Limit Simulation (429)';

  async execute(): Promise<void> {
    throw new HttpException(
      'Too Many Requests: Sisteme çok fazla istek geldiği simüle edildi. Throttling mekanizması devrede.',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
