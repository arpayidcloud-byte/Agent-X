/**
 * @module provider-qualification/load-generator
 * @description Injects artificial load.
 */

export class LoadGenerator {
  generate(_rateRps: number, durationMs: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, durationMs); // Simulated
    });
  }
}
