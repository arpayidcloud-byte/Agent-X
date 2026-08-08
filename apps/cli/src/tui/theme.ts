/**
 * theme.ts — NO_COLOR-aware color helpers.
 *
 * ink 7 does NOT honor NO_COLOR itself (verified: ANSI escapes still emitted
 * with NO_COLOR=1). Every color prop in the TUI must go through c() so the
 * whole app can render plain for piped output / accessibility.
 *
 * Spec (no-color.org): NO_COLOR present AND not empty string → no color.
 * Empty string = unset. TERM=dumb also forces plain output.
 */
const noColorEnv: string | undefined = process.env.NO_COLOR;

export const noColor: boolean =
  (typeof noColorEnv === 'string' && noColorEnv.length > 0) || process.env.TERM === 'dumb';

/** Returns undefined when NO_COLOR is set — ink then renders without ANSI. */
export function c(color: string | undefined): string | undefined {
  return noColor ? undefined : color;
}
