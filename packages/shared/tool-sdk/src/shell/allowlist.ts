/**
 * @module shell/allowlist
 * @description Command allowlist management for shell execution.
 * Reads configuration from agentx.config.yaml per Volume 9 Chapter 5.
 */

import * as fs from 'fs/promises';
import * as yaml from 'yaml';
import type { ShellSandboxConfig } from './interfaces.js';

/** Default allowed programs per Volume 7 */
const DEFAULT_ALLOWED_PROGRAMS = [
  'pnpm',
  'npm',
  'node',
  'git',
  'cargo',
  'rustc',
  'go',
  'python',
  'python3',
  'uv',
  'pytest',
  'docker',
  'docker-compose',
  'turbo',
  'nx',
  'biome',
  'eslint',
  'prettier',
];

/** Default blocked programs per Volume 7 */
const DEFAULT_BLOCKED_PROGRAMS = [
  'rm',
  'mkfs',
  'shutdown',
  'reboot',
  'systemctl',
  'sudo',
  'passwd',
  'useradd',
  'chmod',
  'chown',
  'iptables',
  'mount',
  'umount',
  'dd',
  'killall',
  'kill',
  'curl',
  'wget',
  'scp',
  'ssh',
];

/** Default dangerous flags */
const DEFAULT_DANGEROUS_FLAGS = [
  '--force',
  '-f',
  '--no-preserve-root',
  '--recursive',
  '-r',
  '--system',
  '--global',
  '--unsafe-perm',
];

/**
 * Loads shell sandbox configuration from agentx.config.yaml
 * @returns ShellSandboxConfig with merged defaults
 */
export async function loadShellConfig(configPath?: string): Promise<ShellSandboxConfig> {
  let config: Partial<ShellSandboxConfig> = {};

  if (configPath) {
    try {
      const content = await fs.readFile(configPath, 'utf-8');
      const parsed = yaml.parse(content) as
        { tools?: { shell?: Partial<ShellSandboxConfig> } } | undefined;
      if (parsed?.tools?.shell) {
        config = parsed.tools.shell as Partial<ShellSandboxConfig>;
      }
    } catch {
      // Use defaults on error
    }
  }

  return {
    allowedPrograms: config.allowedPrograms || DEFAULT_ALLOWED_PROGRAMS,
    blockedPrograms: config.blockedPrograms || DEFAULT_BLOCKED_PROGRAMS,
    dangerousFlags: config.dangerousFlags || DEFAULT_DANGEROUS_FLAGS,
    defaultTimeoutMs: config.defaultTimeoutMs || 60000,
    defaultMaxOutputBytes: config.defaultMaxOutputBytes || 10 * 1024 * 1024,
    defaultWorkingDirectory: config.defaultWorkingDirectory || process.cwd(),
    scrubEnvironment: config.scrubEnvironment !== false,
  };
}

/**
 * Checks if a program is in the allowlist
 * @param program - The program name to check
 * @param config - The shell sandbox configuration
 * @returns true if the program is allowed
 */
export function isProgramAllowed(program: string, config: ShellSandboxConfig): boolean {
  return config.allowedPrograms.includes(program);
}

/**
 * Checks if a program is in the blocked list
 * @param program - The program name to check
 * @param config - The shell sandbox configuration
 * @returns true if the program is blocked
 */
export function isProgramBlocked(program: string, config: ShellSandboxConfig): boolean {
  return config.blockedPrograms.includes(program);
}

/**
 * Checks if a flag is dangerous
 * @param flag - The flag to check
 * @param config - The shell sandbox configuration
 * @returns true if the flag is dangerous
 */
export function isFlagDangerous(flag: string, config: ShellSandboxConfig): boolean {
  return config.dangerousFlags.includes(flag);
}
