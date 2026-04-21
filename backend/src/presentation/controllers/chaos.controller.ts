import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { ChaosEngineService } from '../../application/services/chaos-engine.service';
import { LatencyStrategy } from '../../infrastructure/strategies/latency.strategy';
import { Error500Strategy } from '../../infrastructure/strategies/error500.strategy';
import type { IChaosRepository } from '../../domain/interfaces/chaos-repository.interface';

@Controller('chaos')
export class ChaosController {
  constructor(
    private readonly chaosService: ChaosEngineService,
    private readonly latency: LatencyStrategy,
    private readonly error500: Error500Strategy,
    @Inject('IChaosRepository')
    private readonly chaosRepository: IChaosRepository,
  ) {}

  @Get('history')
  async getHistory() {
    const logs = await this.chaosRepository.findAll();
    return logs.map(log => ({
      id: log.id,
      message: log.errorDetails || `Kaos deneyi: ${log.type}`,
      type: log.type,
      aiRecommendation: log.aiRecommendation
    }));
  }

  @Post('trigger')
  async trigger(@Body() body: { type: string; target?: string; params?: any }) {
    const typeUpper = body.type?.toUpperCase();
    if (typeUpper === 'LATENCY') Object.assign(this.chaosService, { strategy: this.latency }); // Using setStrategy dynamically
    this.chaosService.setStrategy(typeUpper === 'LATENCY' ? this.latency : this.error500);
    
    return await this.chaosService.run({
      target: body.target || 'System',
      params: body.params,
    });
  }

  @Get('history/clear')
  async clearHistoryMethodFallback() {
    await this.chaosRepository.clearLogs();
    return { success: true };
  }
}
