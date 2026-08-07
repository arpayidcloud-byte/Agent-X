/**
 * ModelPicker — modal to choose the active LLM provider (Antigravity /model).
 *
 * Keyboard: ↑/↓ navigate · Enter select · Esc back. The provider choice is
 * forwarded to chat/stream (the backend router picks the concrete model).
 */
import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { ProviderInfo } from './types.js';

interface ModelPickerProps {
  providers: ProviderInfo[];
  current: string | null;
  onSelect: (provider: string) => void;
  onClose: () => void;
}

export function ModelPicker({
  providers,
  current,
  onSelect,
  onClose,
}: ModelPickerProps): React.ReactNode {
  const [idx, setIdx] = useState(0);
  const list = providers.filter((p) => p.isActive);
  const all = list.length > 0 ? list : providers;

  useInput((_input, key) => {
    if (key.upArrow) {
      setIdx((prev) => Math.max(0, prev - 1));
      return;
    }
    if (key.downArrow) {
      setIdx((prev) => Math.min(all.length - 1, prev + 1));
      return;
    }
    if (key.return && all[idx] != null) {
      onSelect(all[idx]!.name);
      return;
    }
    if (key.escape) {
      onClose();
    }
  });

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
      <Box justifyContent="space-between">
        <Text bold color="cyanBright">
          ◆ Pilih Provider
        </Text>
        <Text dimColor>↑↓ pilih · Enter ok · esc batal</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        {all.length === 0 && <Text dimColor>(memuat daftar provider…)</Text>}
        {all.map((p, i) => {
          const selected = i === idx;
          const isCurrent = p.name === current;
          return (
            <Box key={p.id} flexDirection="row" gap={1}>
              <Text color={selected ? 'cyan' : 'gray'}>{selected ? '▸' : ' '}</Text>
              <Text bold={selected} color={selected ? 'cyanBright' : undefined}>
                {p.name}
              </Text>
              <Text dimColor>{isCurrent ? '· aktif' : ''}</Text>
            </Box>
          );
        })}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>auto = router memilih provider terbaik (fallback otomatis)</Text>
      </Box>
    </Box>
  );
}
