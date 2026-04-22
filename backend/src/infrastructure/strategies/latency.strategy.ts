import { IChaosStrategy } from '../../domain/strategies/chaos.strategy.interface';

export class LatencyStrategy implements IChaosStrategy {
  name = 'LATENCY';
  async execute(config: { delayMs: number }): Promise<void> {
    const delay = config?.delayMs || 2000;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
