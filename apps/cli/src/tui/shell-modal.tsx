/**
 * ShellModal — ephemeral overlay for shell command output (Antigravity-style).
 *
 * Opens when a `!`-prefixed command is executed in the chat input. Shows the
 * command, exit status, and captured output. Esc / Enter closes it.
 */
import React from 'react';
import { Box, Text, useInput } from 'ink';

export interface ShellResult {
  command: string;
  output: string;
  exitCode: number | null;
  durationMs: number;
  truncated?: boolean;
}

interface ShellModalProps {
  result: ShellResult;
  onClose: () => void;
}

export function ShellModal({ result, onClose }: ShellModalProps): React.ReactNode {
  const ok = result.exitCode === 0;

  useInput((_input, key) => {
    if (key.return || key.escape) onClose();
  });

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor={ok ? 'cyan' : 'red'}>
      <Box justifyContent="space-between">
        <Text bold color="cyanBright">
          ! {result.command}
        </Text>
        <Text dimColor>esc: tutup</Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>
          exit {result.exitCode ?? '—'} · {result.durationMs}ms
          {result.truncated ? ' · output dipotong' : ''}
        </Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        {result.output.length === 0 ? (
          <Text dimColor>(tanpa output)</Text>
        ) : (
          <Text>{result.output}</Text>
        )}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Enter / Esc untuk kembali ke chat</Text>
      </Box>
      {/* Enter is captured by app.tsx useInput; here we just render */}
    </Box>
  );
}
