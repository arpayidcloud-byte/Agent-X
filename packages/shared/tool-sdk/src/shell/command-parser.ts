/**
 * @module shell/command-parser
 * @description Shell command parser that extracts program, arguments, flags,
 * working directory, and detects dangerous patterns.
 */

import type { ParsedCommand } from './interfaces.js';
import { CommandParseError } from './errors.js';

/** Dangerous shell patterns per Volume 7 and Threat Model T-002 */
const DANGEROUS_PATTERNS = [
  // Command injection
  { pattern: /;/, name: 'semicolon' },
  { pattern: /&&/, name: 'logical AND' },
  { pattern: /\|\|/, name: 'logical OR' },
  { pattern: /\|/, name: 'pipe' },
  { pattern: />/, name: 'redirection' },
  { pattern: />>/, name: 'append redirection' },
  { pattern: /</, name: 'input redirection' },
  { pattern: /\$\(/, name: 'command substitution' },
  { pattern: /`/, name: 'backtick substitution' },
  { pattern: /bash\s+-c/, name: 'bash -c' },
  { pattern: /sh\s+-c/, name: 'sh -c' },
  { pattern: /\beval\b/, name: 'eval' },
  { pattern: /\bexec\b/, name: 'exec' },
  { pattern: /\bsource\b/, name: 'source' },
  { pattern: /curl\s.*\|\s*bash/, name: 'curl | bash' },
  { pattern: /wget\s.*\|\s*bash/, name: 'wget | bash' },
  { pattern: /curl\s.*\|\s*sh/, name: 'curl | sh' },
  { pattern: /wget\s.*\|\s*sh/, name: 'wget | sh' },
];

/**
 * Parses a shell command string into structured components
 * @param command - Raw command string
 * @returns Parsed command structure
 * @throws CommandParseError if parsing fails
 */
export function parseCommand(command: string): ParsedCommand {
  if (!command || command.trim().length === 0) {
    throw new CommandParseError(command, 'Empty command');
  }

  const rawCommand = command.trim();

  // Check for dangerous patterns first
  const detectedPatterns = detectDangerousPatterns(rawCommand);

  // Split command into tokens (simple space-based parsing for safety)
  const tokens = tokenize(rawCommand);
  if (tokens.length === 0) {
    throw new CommandParseError(rawCommand, 'No tokens found');
  }

  const program = tokens[0] || '';
  const rest = tokens.slice(1);

  // Extract working directory if present (-C or --directory)
  let workingDirectory: string | undefined;
  const args: string[] = [];
  const flags: string[] = [];
  const envOverrides: Record<string, string> = {};

  for (let i = 0; i < rest.length; i++) {
    const token = rest[i] || '';

    if (token === '-C' || token === '--directory') {
      if (i + 1 < rest.length) {
        workingDirectory = rest[i + 1];
        i++; // Skip next token
      }
    } else if (token.startsWith('-') && !token.startsWith('--')) {
      // Short flag (e.g., -f, -r)
      flags.push(token);
    } else if (token.startsWith('--')) {
      // Long flag (e.g., --force, --verbose)
      if (token.includes('=')) {
        const parts = token.split('=');
        flags.push(parts[0] || '');
        args.push(parts.slice(1).join('='));
      } else {
        flags.push(token);
      }
    } else {
      args.push(token);
    }
  }

  return {
    program,
    args,
    flags,
    workingDirectory: workingDirectory || undefined,
    envOverrides,
    hasPipe: detectedPatterns.includes('pipe'),
    hasRedirection:
      detectedPatterns.includes('redirection') ||
      detectedPatterns.includes('append redirection') ||
      detectedPatterns.includes('input redirection'),
    hasSubshell:
      detectedPatterns.includes('command substitution') ||
      detectedPatterns.includes('backtick substitution'),
    rawCommand,
  };
}

/**
 * Tokenizes a command string, respecting quotes
 * @param command - Command to tokenize
 * @returns Array of tokens
 */
function tokenize(command: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escaped = false;

  for (const char of command) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    if (char === ' ' && !inSingleQuote && !inDoubleQuote) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Detects dangerous patterns in a command
 * @param command - Command to check
 * @returns Array of detected pattern names
 */
export function detectDangerousPatterns(command: string): string[] {
  const detected: string[] = [];
  for (const { pattern, name } of DANGEROUS_PATTERNS) {
    if (pattern.test(command)) {
      detected.push(name);
    }
  }
  return detected;
}

/**
 * Checks if a command contains any injection patterns
 * @param command - Command to check
 * @returns Array of injection pattern names
 */
export function detectInjectionPatterns(command: string): string[] {
  return detectDangerousPatterns(command).filter((name) =>
    [
      'semicolon',
      'logical AND',
      'logical OR',
      'command substitution',
      'backtick substitution',
      'bash -c',
      'sh -c',
      'eval',
      'exec',
      'source',
      'curl | bash',
      'wget | bash',
      'curl | sh',
      'wget | sh',
    ].includes(name),
  );
}
