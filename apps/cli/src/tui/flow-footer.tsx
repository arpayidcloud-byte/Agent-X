import React from 'react';
import { Box, Text } from 'ink';
import { c, palette } from './theme.js';
import { Sparkline } from './sparkline.js';

interface FlowFooterProps {
  running: number;
  total: number;
  activity: number[];
  hint?: string;
}

/** Ambient footer — only shows live count when something is running, otherwise a subtle hint. */
export function FlowFooter({ running, total, activity, hint }: FlowFooterProps): React.ReactNode {
  return (
    <Box justifyContent="space-between">
      <Box flexDirection="row" gap={2}>
        {running > 0 ? (
          <Text color={c(palette.accent)}>▸ {running} running</Text>
        ) : (
          <Text dimColor>idle</Text>
        )}
        <Text dimColor>tasks:{total}</Text>
        <Sparkline data={activity} color={palette.accent} />
      </Box>
      <Text dimColor>{hint ?? 'Tab expand · / commands · q quit'}</Text>
    </Box>
  );
}
