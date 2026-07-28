export interface ShellSandboxConfig {
  allowlist: string[];
  denylist: string[];
  maxCommandLength: number;
  blockPipedCommands: boolean;
}

export class ShellCommandDeniedError extends Error {
  constructor(
    public readonly command: string,
    public readonly reason: string,
  ) {
    super(`Shell command denied: "${command}" — ${reason}`);
    this.name = 'ShellCommandDeniedError';
  }
}

const DEFAULT_DENYLIST = [
  'rm -rf /',
  'rm -rf /*',
  'mkfs',
  'dd if=/dev/',
  ':(){ :|:& };:',
  'chmod -R 777 /',
  'curl | sh',
  'wget | sh',
  'eval',
  'exec',
];

export class ShellSandbox {
  private config: ShellSandboxConfig;

  constructor(config?: Partial<ShellSandboxConfig>) {
    this.config = {
      allowlist: config?.allowlist ?? [],
      denylist: config?.denylist ?? DEFAULT_DENYLIST,
      maxCommandLength: config?.maxCommandLength ?? 10_000,
      blockPipedCommands: config?.blockPipedCommands ?? false,
    };
  }

  validate(command: string): { allowed: boolean; reason?: string } {
    if (command.length > this.config.maxCommandLength) {
      return {
        allowed: false,
        reason: `Command exceeds max length (${this.config.maxCommandLength})`,
      };
    }

    if (this.config.blockPipedCommands && /[|;]/.test(command)) {
      return { allowed: false, reason: 'Piped/chained commands are blocked by policy' };
    }

    for (const denied of this.config.denylist) {
      if (command.includes(denied)) {
        return { allowed: false, reason: `Matches denylist entry: "${denied}"` };
      }
    }

    if (this.config.allowlist.length > 0) {
      const baseCmd = command.split(/\s+/)[0] ?? '';
      const allowed = this.config.allowlist.some(
        (entry) => baseCmd === entry || baseCmd.startsWith(entry + '/'),
      );
      if (!allowed) {
        return {
          allowed: false,
          reason: `"${baseCmd}" not in allowlist [${this.config.allowlist.join(', ')}]`,
        };
      }
    }

    return { allowed: true };
  }

  assertAllowed(command: string): void {
    const result = this.validate(command);
    if (!result.allowed) {
      throw new ShellCommandDeniedError(command, result.reason ?? 'Unknown reason');
    }
  }

  getConfig(): Readonly<ShellSandboxConfig> {
    return { ...this.config };
  }
}
