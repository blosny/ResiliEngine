import { LatencyStrategy } from './latency.strategy';

describe('LatencyStrategy (Unit Test)', () => {
  let strategy: LatencyStrategy;

  beforeEach(() => {
    strategy = new LatencyStrategy();
  });

  // FACT: Varsayılan gecikme testi
  it('should have the correct name', () => {
    expect(strategy.name).toBe('LATENCY');
  });

  // THEORY: Farklı gecikme süreleri için test (Hocanın istediği it.each)
  it.each([{ delayMs: 500 }, { delayMs: 1000 }])(
    'should delay execution for approximately %p ms',
    async ({ delayMs }) => {
      const start = Date.now();
      await strategy.execute({ delayMs });
      const end = Date.now();

      // İşlem süresi verilen gecikmeden büyük veya eşit olmalı
      expect(end - start).toBeGreaterThanOrEqual(delayMs);
    },
  );
});
