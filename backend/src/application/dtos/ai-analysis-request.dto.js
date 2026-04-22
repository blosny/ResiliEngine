export class AiAnalysisRequestDto {
    experimentId;
    chaosType; // LATENCY, ERROR_500 vb.
    targetService;
    timestamp;
    logs;
    metrics;
}
