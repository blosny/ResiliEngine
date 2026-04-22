export class AiAnalysisRequestDto {
  experimentId: string;
  chaosType: string; // LATENCY, ERROR_500 vb.
  targetService: string;
  timestamp: Date;
  logs: string;
  metrics: {
    responseTime?: number;
    errorCount?: number;
    cpuUsage?: number;
  };
}
