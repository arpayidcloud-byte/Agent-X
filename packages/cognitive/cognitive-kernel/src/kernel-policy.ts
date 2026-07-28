/**
 * @module cognitive-kernel/kernel-policy
 * @description Safety and operational policy compliance.
 */

export class KernelPolicy {
  validateMaxDepth(depth: number, maxAllowed: number): boolean {
    return depth <= maxAllowed;
  }

  validateTimeout(durationMs: number, limitMs: number): boolean {
    return durationMs <= limitMs;
  }
}
