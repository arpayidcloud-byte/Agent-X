/**
 * Spinner — braille frame animation (⠋⠙⠹⠸⠼⠴⠦⠧), ~80ms cycle.
 * Used for connecting / streaming / any async state.
 */
import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import { c } from './theme.js';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧'];

export function Spinner({ color = '#FFC24B' }: { color?: string }): React.ReactNode {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 80);
    return () => clearInterval(id);
  }, []);
  return <Text color={c(color)}>{FRAMES[frame]}</Text>;
}
