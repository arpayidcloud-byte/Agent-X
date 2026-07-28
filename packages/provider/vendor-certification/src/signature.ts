/**
 * @module vendor-certification/signature
 * @description Provides dummy platform signing stubs.
 */

export class PlatformSignature {
  sign(payload: string): string {
    // Simulated asymmetric signing
    return `sig-${Buffer.from(payload).toString('base64').substring(0, 24)}`;
  }
}
