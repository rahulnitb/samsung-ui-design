import { useEffect, useRef, useState } from 'react';

export const OVERLAY_EXIT_MS = 320;

/** Keeps an overlay mounted for its exit animation after `open` turns false. */
export function usePresence(open, exitMs = OVERLAY_EXIT_MS) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }
    const timer = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(timer);
  }, [open, exitMs]);

  return { mounted: mounted || open, closing: mounted && !open };
}

/** Returns `value`, or the last non-null value it had (so closing overlays keep their content). */
export function useLastDefined(value) {
  const ref = useRef(value);
  if (value != null) ref.current = value;
  return value ?? ref.current;
}
