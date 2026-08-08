/**
 * BootScreen — "Command Deck" splash (AgentX TUI Design v2).
 *
 * ASCII logo with a magenta→cyan gradient per line, tagline, and a live
 * connecting spinner that flips to ✓ connected. Auto-proceeds via onDone
 * after the handshake settles (~1.6s), or immediately when Esc is pressed.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Spinner } from './spinner.js';
import { c, palette } from './theme.js';

const LOGO = [
  '   ___                    __     _  __',
  '  / _ | ___ ____ ___  ___ / /_   | |/_/',
  ' / __ |/ _ `/ -_) _ \\/ -_) __/  _>  <',
  '/_/ |_|\\_, /\\__/_//_/\\__/\\__/  /_/|_|',
  '      /___/',
];

/** Gradient per line: magenta → cyan (energy flowing left to right). */
const LOGO_COLORS = [palette.brand, palette.brandBright, palette.accent, palette.accent];

const TAGLINE = '  M U L T I - A G E N T   R U N T I M E';

interface BootScreenProps {
  version: string;
  /** True when the API handshake already succeeded. */
  connected: boolean;
  onDone: () => void;
}

export function BootScreen({ version, connected, onDone }: BootScreenProps): React.ReactNode {
  const [ready, setReady] = useState(false);
  const [lines, setLines] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  // Fade-in per line (~80ms/line, Command Deck v2 §1) then handshake state.
  useEffect(() => {
    const lineTimer = setInterval(() => {
      setLines((n) => (n >= LOGO.length ? n : n + 1));
    }, 80);
    const t1 = setTimeout(() => setReady(true), connected ? 600 : 1200);
    const t2 = setTimeout(() => doneRef.current(), connected ? 1500 : 2200);
    return () => {
      clearInterval(lineTimer);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [connected]);

  useInput((_input, key) => {
    if (key.escape) onDone();
  });

  return (
    <Box flexDirection="column" alignItems="center" paddingY={2}>
      {LOGO.slice(0, lines).map((line, i) => (
        <Text key={i} bold color={c(LOGO_COLORS[i % LOGO_COLORS.length])}>
          {line}
        </Text>
      ))}
      {lines >= LOGO.length && (
        <>
          <Text dimColor>{TAGLINE}</Text>
          <Text dimColor>{'─'.repeat(46)}</Text>
          <Box marginTop={1}>
            {ready ? (
              <Text color={c(palette.ok)}>✓ connected</Text>
            ) : (
              <Text color={c(palette.warn)}>
                <Spinner /> v{version} · api: connecting…
              </Text>
            )}
          </Box>
          <Box marginTop={1}>
            <Text dimColor>esc: lewati</Text>
          </Box>
        </>
      )}
    </Box>
  );
}
