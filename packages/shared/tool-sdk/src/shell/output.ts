/**
 * @module shell/output
 * @description Output collection for shell execution.
 * Collects stdout, stderr, exit code, signal, and duration.
 */

/** Collected output from a shell execution */
export interface CollectedOutput {
  /** Standard output as string */
  stdout: string;
  /** Standard error as string */
  stderr: string;
  /** Exit code from the process */
  exitCode: number;
  /** Signal that terminated the process */
  signal?: string;
  /** Duration in milliseconds */
  durationMs: number;
  /** Whether the output was truncated */
  truncated: boolean;
}

/**
 * Creates an empty collected output
 * @returns Empty CollectedOutput
 */
export function createEmptyOutput(): CollectedOutput {
  return {
    stdout: '',
    stderr: '',
    exitCode: 0,
    durationMs: 0,
    truncated: false,
  };
}

/**
 * Truncates output to fit within size limit
 * @param output - Output string to truncate
 * @param maxLength - Maximum length in bytes
 * @returns Truncated output
 */
export function truncateOutput(
  output: string,
  maxLength: number,
): { output: string; truncated: boolean } {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(output);

  if (encoded.length <= maxLength) {
    return { output, truncated: false };
  }

  const truncated = new TextDecoder().decode(encoded.slice(0, maxLength));
  return { output: truncated + '\n[OUTPUT TRUNCATED]', truncated: true };
}
