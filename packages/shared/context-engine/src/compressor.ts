import type { IContextCompressor } from './interfaces.js';

export class ContextCompressor implements IContextCompressor {
  public compress(data: Record<string, unknown>, ratio: number): Record<string, unknown> {
    if (ratio >= 1.0) return { ...data };

    // Simple compression: remove nulls, undefined, and truncate long strings
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) continue;

      if (typeof value === 'string' && value.length > 100) {
        result[key] = value.substring(0, Math.floor(value.length * ratio)) + '...';
      } else if (Array.isArray(value)) {
        result[key] = value.slice(0, Math.max(1, Math.floor(value.length * ratio)));
      } else if (typeof value === 'object') {
        result[key] = this.compress(value as Record<string, unknown>, ratio);
      } else {
        result[key] = value;
      }
    }

    return result;
  }
}
