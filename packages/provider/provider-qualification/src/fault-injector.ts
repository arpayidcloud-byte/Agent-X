/**
 * @module provider-qualification/fault-injector
 * @description Simulates specific component faults.
 */

export class FaultInjector {
  injectCrash(): void {
    // simulated crash
  }

  injectDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  injectDisconnect(): void {
    // simulated disconnect
  }
}
