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

/** Footer plek mock: ─ ▸ N running · tasks:N ▁ · Tab expand · / palette · q quit */
export function FlowFooter({ running, total, activity, hint }: FlowFooterProps): React.ReactNode {
  return (
    <Box flexDirection="column" gap={1}>
      <Text dimColor>{'─'.repeat(48)}</Text>
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
        <Text dimColor>{hint ?? 'Tab expand · / palette · q quit'}</Text>
      </Box>
    </Box>
  );
}
