import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { ChaosEngineService } from '../../application/services/chaos-engine.service';
import { LatencyStrategy } from '../../infrastructure/strategies/latency.strategy';
import { Error500Strategy } from '../../infrastructure/strategies/error500.strategy';
import { Error429Strategy } from '../../infrastructure/strategies/error429.strategy';
import { Error401Strategy } from '../../infrastructure/strategies/error401.strategy';
import type { IChaosRepository } from '../../domain/interfaces/chaos-repository.interface';

@Controller('chaos')
export class ChaosController {
  constructor(
    private readonly chaosService: ChaosEngineService,
    private readonly latency: LatencyStrategy,
    private readonly error500: Error500Strategy,
    private readonly error429: Error429Strategy,
    private readonly error401: Error401Strategy,
    @Inject('IChaosRepository')
    private readonly chaosRepository: IChaosRepository,
  ) {}

  @Get('history')
  async getHistory() {
    const logs = await this.chaosRepository.findAll();
    return logs.map((log) => ({
      id: log.id,
      message: log.errorDetails || `Kaos deneyi: ${log.type}`,
      type: log.type,
      aiRecommendation: log.aiRecommendation,
      timestamp: log.timestamp,
      status: log.status,
      target: log.target,
      duration: log.duration,
    }));
  }

  @Post('trigger')
  async trigger(@Body() body: { type: string; target?: string; params?: any }) {
    const typeUpper = body.type?.toUpperCase();

    // Strateji seçimi
    switch (typeUpper) {
      case 'LATENCY':
        this.chaosService.setStrategy(this.latency);
        break;
      case 'RATE_LIMIT':
      case '429':
        this.chaosService.setStrategy(this.error429);
        break;
      case 'UNAUTHORIZED':
      case '401':
        this.chaosService.setStrategy(this.error401);
        break;
      default:
        this.chaosService.setStrategy(this.error500);
        break;
    }

    return await this.chaosService.executeStrategy({
      target: body.target || 'System',
      params: body.params,
    });
  }

  @Get('history/clear')
  async clearHistory() {
    await this.chaosRepository.clearLogs();
    return { success: true };
  }
}
