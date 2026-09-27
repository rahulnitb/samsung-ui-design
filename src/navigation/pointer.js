// Shared pointer/keyboard arbitration.
// After a key press, content scrolls under a stationary mouse and the browser fires
// synthetic mouse events; hover must not steal focus from the remote during that time.
const HOVER_LOCK_AFTER_KEY_MS = 600;

let lastKeyAt = -Infinity;

export function noteKeyPress() {
  lastKeyAt = performance.now();
}

export function hoverAllowed() {
  return performance.now() - lastKeyAt > HOVER_LOCK_AFTER_KEY_MS;
}
