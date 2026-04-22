import { Error500Strategy } from './error500.strategy';
import { HttpException } from '@nestjs/common';

describe('Error500Strategy (Unit Test)', () => {
  let strategy: Error500Strategy;

  beforeEach(() => {
    strategy = new Error500Strategy();
  });

  it('should throw an Internal Server Error (500)', async () => {
    // Stratejinin hata fırlatmasını bekliyoruz
    await expect(strategy.execute()).rejects.toThrow(HttpException);

    try {
      await strategy.execute();
    } catch (error) {
      expect(error.getStatus()).toBe(500);
      expect(error.message).toContain('Simulated');
    }
  });
});
