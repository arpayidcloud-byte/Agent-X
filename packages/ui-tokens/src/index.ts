/**
 * AgentX UI Tokens — single source of truth for design system values.
 *
 * Each app (landing, web, admin) imports this module to access raw values.
 * CSS variables in each app's globals.css MUST mirror these.
 *
 * Two palettes ship here:
 *   - palette:    Obsidian dark surfaces + sapphire/indigo accents (apps/web, apps/admin)
 *   - linearPalette: marketing black + Linear-style indigo (#5e6ad2) + translucent borders
 *                   (apps/landing)
 */

export const palette = {
  surface: {
    0: '#000000',
    1: '#08080c',
    2: '#0f0f16',
    3: '#18181f',
    4: '#23232e',
    5: '#2e2e3a',
  },
  accent: {
    100: '#c7d2fe',
    200: '#a5b4fc',
    300: '#818cf8',
    400: '#6366f1',
    500: '#4f46e5',
    600: '#4338ca',
    700: '#3730a3',
  },
  secondary: {
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
  },
  semantic: {
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
    info: '#60a5fa',
  },
} as const;

/**
 * Linear-inspired marketing palette — used by apps/landing.
 * Mirrors Linear.app's exact marketing design system (Aug 2026).
 */
export const linearPalette = {
  // Marketing background — Linear's true near-black, slightly cooler than pure OLED
  bg: '#08090a',

  // Brand indigo — Linear's primary accent (#5e6ad2 exact, brighter variant #7170ff)
  brand: '#5e6ad2',
  brandBright: '#7170ff',

  // Text colors — Linear's strict 3-tier hierarchy
  textPrimary: '#f7f8f8',
  textSecondary: '#8a8f98',
  textTertiary: '#62666d',

  // Borders — Linear uses translucent whites, never solid grays
  borderSubtle: 'rgba(255, 255, 255, 0.05)',
  borderDefault: 'rgba(255, 255, 255, 0.08)',
  borderHover: 'rgba(255, 255, 255, 0.12)',

  // Surface layers — translucent white overlays on marketing black
  surfaceGhost: 'rgba(255, 255, 255, 0.02)',
  surfaceCard: 'rgba(255, 255, 255, 0.04)',
  surfaceHover: 'rgba(255, 255, 255, 0.06)',

  // Accent state overlays
  accentGhost: 'rgba(94, 106, 210, 0.08)',
  accentBorder: 'rgba(113, 112, 255, 0.32)',
} as const;

export type TokenKey = 'surface' | 'accent' | 'secondary' | 'semantic';

/**
 * Inter Variable font-feature-settings — Linear-style typography.
 * cv01: alternate digit shapes (monospaced numerals in headings)
 * ss03: curly tail on lowercase 'a' (Linear uses this for modern feel)
 */
export const LINEAR_FONT_FEATURES = '"cv01", "ss03"' as const;

/**
 * Linear-style headline spec.
 * Hero headlines are 48px, weight 510 (Inter Variable's "Medium"), tightly tracked.
 */
export const LINEAR_HEADLINE = {
  size: '48px',
  weight: 510,
  letterSpacing: '-1.056px',
  lineHeight: '1.1',
} as const;

export const LINEAR_SUBTITLE = {
  size: '18px',
  weight: 400,
  color: linearPalette.textSecondary,
} as const;

/**
 * Linear-style button radii — small (6px) for both brand and ghost.
 */
export const LINEAR_RADIUS = {
  button: '6px',
  card: '8px',
  panel: '10px',
} as const;
