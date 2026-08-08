/**
 * Sparkline — dependency-free mini bar chart (Command Deck v2 §3).
 *
 * Renders a numeric series with block chars ▁▂▃▄▅▆▇█ (8 levels), normalized to
 * the series max. Monochrome-safe: color only as accent, glyphs carry the data.
 */
import React from 'react';
import { Text } from 'ink';
import { c, palette } from './theme.js';

const BLOCKS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

interface SparklineProps {
  data: number[];
  /** Optional width (last N points). */
  width?: number;
  color?: string;
}

export function Sparkline({
  data,
  width = 12,
  color = palette.accent,
}: SparklineProps): React.ReactNode {
  if (data.length === 0) return <Text dimColor>▁▁▁▁</Text>;
  const series = data.slice(-width);
  const max = Math.max(...series);
  if (max <= 0) return <Text dimColor>{'▁'.repeat(Math.min(series.length, width))}</Text>;
  return (
    <Text color={c(color)}>
      {series
        .map(
          (v) => BLOCKS[Math.min(BLOCKS.length - 1, Math.floor((v / max) * (BLOCKS.length - 1)))]!,
        )
        .join('')}
    </Text>
  );
}
