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
    // ChaosEngineService içindeki metod ismini 'run' yaptığımız için burada da 'run' diyoruz.
    await this.chaosEngine.run({
      target: context.getClass().name + '.' + context.getHandler().name,
    });

    return next.handle();
  }
}
