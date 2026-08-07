import React from 'react';
import { Box, Text } from 'ink';
import type { PanelId } from './types.js';

interface NavBarProps {
  activePanel: PanelId;
  onNavigate: (panel: PanelId) => void;
}

const TABS: { id: PanelId; label: string; key: string }[] = [
  { id: 'dashboard', label: 'Dashboard', key: '1' },
  { id: 'tasks', label: 'Tasks', key: '2' },
  { id: 'providers', label: 'Providers', key: '3' },
  { id: 'cost', label: 'Cost', key: '4' },
  { id: 'settings', label: 'Settings', key: '5' },
];

export function NavBar({ activePanel }: NavBarProps): React.ReactNode {
  return (
    <Box flexDirection="row" gap={1} paddingX={1}>
      {TABS.map((tab) => {
        const isActive = tab.id === activePanel;
        return (
          <Box key={tab.id}>
            <Text
              bold={isActive}
              color={isActive ? 'cyanBright' : 'dimColor'}
              backgroundColor={isActive ? 'blue' : undefined}
              inverse={isActive}
            >
              {` ${tab.key}:${tab.label} `}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
