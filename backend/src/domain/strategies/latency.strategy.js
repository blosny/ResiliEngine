export class LatencyStrategy {
    durationMs;
    name = 'Latency Injection';
    constructor(durationMs = 2000) {
        this.durationMs = durationMs;
    }
    async execute() {
        console.log(`[Chaos] ${this.durationMs}ms gecikme enjekte ediliyor...`);
        return new Promise((resolve) => setTimeout(resolve, this.durationMs));
    }
}
