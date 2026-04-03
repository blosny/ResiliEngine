import { IChaosStrategy } from './chaos.strategy.interface';

export class LatencyStrategy implements IChaosStrategy {
  name = 'Latency Injection';

  constructor(private readonly durationMs: number = 2000) {}

  async execute(): Promise<void> {
    console.log(`[Chaos] ${this.durationMs}ms gecikme enjekte ediliyor...`);
    return new Promise((resolve) => setTimeout(resolve, this.durationMs));
  }
}
