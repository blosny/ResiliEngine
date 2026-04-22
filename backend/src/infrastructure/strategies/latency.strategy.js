export class LatencyStrategy {
    name = 'LATENCY';
    async execute(config) {
        const delay = config?.delayMs || 2000;
        return new Promise((resolve) => setTimeout(resolve, delay));
    }
}
