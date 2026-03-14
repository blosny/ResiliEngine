import { HttpException, HttpStatus } from '@nestjs/common';
import { IChaosStrategy } from '../../domain/strategies/chaos.strategy.interface';

export class Error500Strategy implements IChaosStrategy {
  name = 'ERROR_500';
  async execute(): Promise<void> {
    throw new HttpException('Simulated Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}