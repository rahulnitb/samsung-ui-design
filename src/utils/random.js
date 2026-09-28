// Shared deterministic-randomness helpers, used anywhere mock content needs to look
// varied but stay stable across re-renders/reloads (QR pattern art, search suggestions,
// mock API ids).

export function hashString(text) {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(value);
}

// Small, fast, deterministic PRNG (mulberry32) seeded from hashString above.
export function createRandom(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A short, URL/id-safe pseudo-random token, e.g. randomId('qr') -> "qr-k3f9a2p1".
export function randomId(prefix) {
  const seed = hashString(`${prefix}-${Date.now()}-${Math.random()}`);
  return `${prefix}-${seed.toString(36).slice(0, 8)}`;
}
