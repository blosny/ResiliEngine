import { Controller, Post, Body } from '@nestjs/common';
import { ChaosEngineService } from '../../application/services/chaos-engine.service';
import { LatencyStrategy } from '../../infrastructure/strategies/latency.strategy';
import { Error500Strategy } from '../../infrastructure/strategies/error500.strategy';

@Controller('chaos')
export class ChaosController {
  constructor(
    private readonly chaosService: ChaosEngineService,
    private readonly latency: LatencyStrategy,
    private readonly error500: Error500Strategy,
  ) {}

  @Post('trigger')
  async trigger(@Body() body: { type: string; target: string; params?: any }) {
    if (body.type === 'LATENCY') this.chaosService.setStrategy(this.latency);
    if (body.type === 'ERROR_500') this.chaosService.setStrategy(this.error500);

    // HATA ÇÖZÜMÜ: 'runExperiment' yerine 'run' kullanıyoruz
    return await this.chaosService.run({
      target: body.target,
      params: body.params,
    });
  }
}
