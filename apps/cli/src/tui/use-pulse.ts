/**
 * usePulse — dim → bright → dim oscillation (Command Deck v2 §5 micro-animations).
 *
 * Returns true on the "bright" half of the cycle (~600ms period). Used to draw
 * the eye to active agents (running task rows, live status dots).
 */
import { useEffect, useState } from 'react';

export function usePulse(active: boolean, periodMs = 600): boolean {
  const [bright, setBright] = useState(false);
  useEffect(() => {
    if (!active) {
      setBright(false);
      return;
    }
    const id = setInterval(() => setBright((b) => !b), periodMs / 2);
    return () => clearInterval(id);
  }, [active, periodMs]);
  return active && bright;
}
