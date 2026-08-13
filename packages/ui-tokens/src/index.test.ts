import { describe, it, expect } from 'vitest';
import { palette } from './index.js';

describe('@agent-xai/ui-tokens', () => {
  it('exposes OLED surfaces', () => {
    expect(palette.surface[0]).toBe('#000000');
    expect(palette.surface[1]).toBe('#08080c');
  });

  it('exposes accent ramp', () => {
    expect(palette.accent[400]).toBe('#6366f1');
    expect(palette.accent[500]).toBe('#4f46e5');
  });

  it('exposes semantic colors', () => {
    expect(palette.semantic.success).toBe('#34d399');
    expect(palette.semantic.danger).toBe('#f87171');
  });
});
