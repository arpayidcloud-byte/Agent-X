import React from 'react';
import { Box, Text } from 'ink';
import { c, palette } from './theme.js';

interface WarpBlockProps {
  title: string;
  stamp: string;
  status: 'run' | 'done' | 'idle';
  children: React.ReactNode;
}

/**
 * Warp block — ┌─ ❯ title ── stamp ●/✓ ─┐ + body.
 * Rounded border like the header box, so the whole screen feels like Warp.
 */
export function WarpBlock({ title, stamp, status, children }: WarpBlockProps): React.ReactNode {
  const glyph = status === 'run' ? '●' : status === 'done' ? '✓' : '○';
  const color = status === 'run' ? palette.accent : status === 'done' ? palette.ok : palette.dim;
  const borderColor = status === 'run' ? palette.accent : palette.borderPassive;
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={c(borderColor)}
      paddingX={1}
      paddingY={1}
      marginBottom={1}
    >
      <Box justifyContent="space-between">
        <Text bold color={c(palette.accentBright)}>
          ─ ❯ {title}
        </Text>
        <Text color={c(color)}>
          {stamp} {glyph}
        </Text>
      </Box>
      <Box flexDirection="column" marginTop={1}>
        {children}
      </Box>
    </Box>
  );
}
