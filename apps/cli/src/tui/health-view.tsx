/**
 * HealthView — service status grid (Command Deck v2 §6 "Config/Health").
 *
 * Card grid: API gateway + every LLM provider, with uptime/status indicators.
 * Data comes from the real /health fetch (status, uptime, providers).
 */
import React from 'react';
import { Box, Text } from 'ink';
import type { HealthResponse } from './types.js';
import { c, palette, statusColor, statusBadge } from './theme.js';

interface HealthViewProps {
  health: HealthResponse | null;
  loading: boolean;
}

interface HealthProvider {
  name: string;
  status: string;
  lastChecked?: string;
}

function formatUptime(sec?: number): string {
  if (sec == null) return '—';
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function HealthView({ health, loading }: HealthViewProps): React.ReactNode {
  const apiStatus = health?.status === 'ok' || health?.status === 'healthy' ? 'healthy' : 'error';
  const providers = (health as HealthResponse & { providers?: HealthProvider[] })?.providers ?? [];
  const cards = [
    {
      name: 'api.id-tech.cloud',
      status: apiStatus,
      note: health?.uptime ? `uptime ${formatUptime(health.uptime)}` : '—',
    },
    ...providers.map((p) => ({
      name: p.name,
      status: p.status,
      note: p.lastChecked
        ? `checked ${new Date(p.lastChecked).toLocaleTimeString('en-GB', { hour12: false })}`
        : '',
    })),
  ];
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color={c(palette.accent)}>
          ◆ Service Health
        </Text>
        {loading && <Text dimColor> memuat…</Text>}
      </Box>

      <Box flexDirection="row" gap={1} flexWrap="wrap">
        {cards.map((card) => (
          <Box
            key={card.name}
            flexDirection="column"
            borderStyle="round"
            borderColor={c(statusColor(card.status))}
            paddingX={2}
            paddingY={1}
            width={30}
          >
            <Box flexDirection="row" gap={1}>
              <Text color={c(statusColor(card.status))}>
                {statusBadge(card.status)} {card.name}
              </Text>
            </Box>
            <Text dimColor>{card.note}</Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={1}>
        <Text dimColor>[esc] kembali · polling otomatis tiap 15s</Text>
      </Box>
    </Box>
  );
}
