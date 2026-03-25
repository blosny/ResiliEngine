import { Controller, Post, Get, Body } from '@nestjs/common';
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

  /**
   * POST /chaos/trigger
   * Yeni bir kaos deneyi başlatır.
   */
  @Post('trigger')
  async trigger(@Body() body: { type: string; target: string; params?: any }) {
    // Strategy Pattern: Gelen tip'e göre strateji seçimi
    if (body.type === 'LATENCY') {
      this.chaosService.setStrategy(this.latency);
    } else if (body.type === 'ERROR_500') {
      this.chaosService.setStrategy(this.error500);
    }

    // Servis içindeki yeni metod ismini çağırıyoruz
    return await this.chaosService.executeStrategy({
      target: body.target,
      params: body.params,
    });
  }

  /**
   * GET /chaos/history
   * STAGE 4: Tüm deney geçmişini listeleyen endpoint.
   */
  @Get('history')
  async getHistory() {
    return await this.chaosService.getHistory();
  }
}
