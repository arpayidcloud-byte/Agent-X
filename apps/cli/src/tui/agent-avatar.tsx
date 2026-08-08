/**
 * AgentAvatar — 2-character identity icon per agent role (Command Deck v2 §4).
 *
 * Roles map to fixed glyph + color so agents are recognizable at a glance in
 * long lists. When no role matches, derive one from the provider/model name
 * keywords (coder → </>, reviewer → ✓?, memory → ▤▤, orchestrator → ◆◆).
 */
import React from 'react';
import { Text } from 'ink';
import { c, palette } from './theme.js';

export interface AgentRoleStyle {
  glyph: string;
  color: string;
}

/** Fixed per-role identities (Command Deck v2 §4 table). */
export const ROLE_STYLES: Record<string, AgentRoleStyle> = {
  orchestrator: { glyph: '◆◆', color: palette.brand },
  coder: { glyph: '</>', color: palette.accent },
  reviewer: { glyph: '✓?', color: palette.warn },
  'memory-engine': { glyph: '▤▤', color: palette.ok },
};

export const CUSTOM_STYLE: AgentRoleStyle = { glyph: '※※', color: palette.dim };

/** Derive a role from a provider/model name (or explicit role). */
export function deriveRole(name?: string, role?: string): AgentRoleStyle {
  if (role && ROLE_STYLES[role] != null) return ROLE_STYLES[role]!;
  const hay = (name ?? '').toLowerCase();
  if (hay.includes('coder') || hay.includes('codex') || hay.includes('claude'))
    return ROLE_STYLES.coder!;
  if (hay.includes('review')) return ROLE_STYLES.reviewer!;
  if (hay.includes('memory') || hay.includes('embed')) return ROLE_STYLES['memory-engine']!;
  if (hay.includes('orchestr') || hay.includes('architect') || hay.includes('agent')) {
    return ROLE_STYLES.orchestrator!;
  }
  return CUSTOM_STYLE;
}

interface AgentAvatarProps {
  /** Provider/model name used to derive the style. */
  name?: string;
  /** Explicit role override (orchestrator | coder | reviewer | memory-engine). */
  role?: string;
  /** Show a smaller/dimmer variant (e.g. inside dense rows). */
  dim?: boolean;
}

export function AgentAvatar({ name, role, dim = false }: AgentAvatarProps): React.ReactNode {
  const style = deriveRole(name, role);
  return (
    <Text bold color={c(style.color)} dimColor={dim}>
      {style.glyph}
    </Text>
  );
}
