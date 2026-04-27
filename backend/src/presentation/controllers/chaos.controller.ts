import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { ChaosEngineService } from '../../application/services/chaos-engine.service';
import { LatencyStrategy } from '../../infrastructure/strategies/latency.strategy';
import { Error500Strategy } from '../../infrastructure/strategies/error500.strategy';
import { Error429Strategy } from '../../infrastructure/strategies/error429.strategy';
import { Error401Strategy } from '../../infrastructure/strategies/error401.strategy';
import { TerminalMonitorService } from '../../infrastructure/services/terminal-monitor.service'; // SCRUM-36
import { PathExtractorService } from '../../infrastructure/services/path-extractor.service'; // SCRUM-37
import type { IChaosRepository } from '../../domain/interfaces/chaos-repository.interface';

@Controller('chaos')
export class ChaosController {
  constructor(
    private readonly chaosService: ChaosEngineService,
    private readonly latency: LatencyStrategy,
    private readonly error500: Error500Strategy,
    private readonly error429: Error429Strategy,
    private readonly error401: Error401Strategy,
    private readonly terminalMonitor: TerminalMonitorService, // SCRUM-36
    private readonly pathExtractor: PathExtractorService, // SCRUM-37
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

  /**
   * POST /chaos/monitor (SCRUM-36)
   * Terminal çıktılarını dinlemeyi başlatır.
   */
  @Post('monitor')
  async startMonitor(@Body() body: { command: string; args?: string[] }) {
    this.terminalMonitor.monitorCommand(body.command, body.args || []);
    return {
      success: true,
      message: `SCRUM-36: '${body.command}' izleniyor.`,
    };
  }

  /**
   * POST /chaos/parse-logs (SCRUM-37)
   * Gönderilen log metni içindeki dosya yollarını ayıklar.
   */
  @Post('parse-logs')
  async parseLogs(@Body() body: { logs: string }) {
    const paths = this.pathExtractor.extractPaths(body.logs);
    return {
      success: true,
      detectedPaths: paths,
      count: paths.length,
    };
  }

  @Get('history/clear')
  async clearHistory() {
    await this.chaosRepository.clearLogs();
    return { success: true };
  }
}
