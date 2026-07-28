export class RedactedString {
  private readonly rawValue: string;

  constructor(value: string) {
    this.rawValue = value;
  }

  toString(): string {
    return '[REDACTED]';
  }

  toJSON(): string {
    return '[REDACTED]';
  }

  valueOf(): string {
    return '[REDACTED]';
  }

  [Symbol.toPrimitive](_hint: string): string {
    return '[REDACTED]';
  }

  getRawValue(): string {
    return this.rawValue;
  }
}

export const scrubEnvironment = (
  env: Record<string, string | undefined>,
): Record<string, string | undefined> => {
  const result: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('AGENTX_SECRET_')) {
      result[key] = undefined;
    } else {
      result[key] = value;
    }
  }
  return result;
};
