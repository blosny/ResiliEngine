import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IChaosStrategy } from '../../domain/strategies/chaos.strategy.interface';

@Injectable()
export class Error401Strategy implements IChaosStrategy {
  name = 'Unauthorized Simulation (401)';

  async execute(): Promise<void> {
    throw new HttpException(
      'Unauthorized: Kimlik doğrulama başarısız. Token geçersiz veya süresi dolmuş gibi davranılıyor.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
