import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChaosEngineService } from '../../application/services/chaos-engine.service';

@Injectable()
export class ChaosInterceptor implements NestInterceptor {
  constructor(private readonly chaosEngine: ChaosEngineService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // Stage 4: Bazı isteklerde kaos motorunu tetikle
    // await this.chaosEngine.executeStrategy({ target: 'Global Interceptor' });
    return next.handle();
  }
}
