/**
 * theme.ts — "Neon Cyber" palette (AgentX TUI Design v2) + NO_COLOR support.
 *
 * ink 7 maps hex colors to the nearest 256-color ANSI automatically (verified:
 * '#FF2E9E' → 38;5;205), so true-color hex works on any terminal. NO_COLOR is
 * NOT honored by ink itself — every color prop must go through c() so the app
 * renders plain for piped output / accessibility (spec: no-color.org).
 */
export const palette = {
  brand: '#FF2E9E', // primary magenta
  brandBright: '#FF6EC7', // lighter magenta
  accent: '#33F0FF', // cyan
  accentBright: '#7DF9FF', // lighter cyan
  ok: '#39FF88', // neon green
  warn: '#FFC24B', // amber
  danger: '#FF4757', // red
  borderActive: '#33F0FF',
  borderPassive: '#3A3D4A',
  dim: '#8A8FA3',
} as const;

/** Terminal-emitted ANSI 16-color names for non-truecolor fallback. */
export const ansi = {
  brand: 'magenta',
  brandBright: 'magentaBright',
  accent: 'cyan',
  accentBright: 'cyanBright',
  ok: 'green',
  warn: 'yellow',
  danger: 'red',
} as const;

const noColorEnv: string | undefined = process.env.NO_COLOR;

export const noColor: boolean =
  (typeof noColorEnv === 'string' && noColorEnv.length > 0) || process.env.TERM === 'dumb';

/** Returns undefined when NO_COLOR is set — ink then renders without ANSI. */
export function c(color: string | undefined): string | undefined {
  return noColor ? undefined : color;
}

/** Status → color (shared by task list, log tail, etc.). */
export function statusColor(status: string): string {
  switch (status) {
    case 'success':
    case 'complete':
    case 'completed':
    case 'idle':
      return palette.ok;
    case 'running':
    case 'pending':
    case 'waiting':
      return palette.warn;
    case 'error':
    case 'failed':
    case 'offline':
      return palette.danger;
    default:
      return palette.dim;
  }
}

/** Status → badge glyph, readable even in monochrome terminals. */
export function statusBadge(status: string): string {
  switch (status) {
    case 'success':
    case 'complete':
    case 'completed':
    case 'idle':
      return '●';
    case 'running':
      return '▸';
    case 'pending':
    case 'waiting':
      return '◔';
    case 'error':
    case 'failed':
    case 'offline':
      return '✕';
    default:
      return '○';
  }
}
