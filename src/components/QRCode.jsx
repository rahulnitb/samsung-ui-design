// A visually convincing QR-style pattern generated from `value` — proper finder
// squares in three corners and a timing line, like a real QR code, but the "data"
// modules are deterministic pseudo-random noise rather than a real encoding. This is
// a browser simulation (see README), so it's decorative, not a scannable code.
const MODULES = 21; // matches a real QR "version 1" grid, for an authentic look

function hashString(text) {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(value);
}

// Small, fast, deterministic PRNG (mulberry32) seeded from the hash above.
function createRandom(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FINDER_ORIGINS = [
  [0, 0],
  [0, MODULES - 7],
  [MODULES - 7, 0],
];

function isDark(row, col, next) {
  for (const [fr, fc] of FINDER_ORIGINS) {
    if (row >= fr && row < fr + 7 && col >= fc && col < fc + 7) {
      const r = row - fr;
      const c = col - fc;
      return r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
    }
  }
  if (row === 6 || col === 6) return (row + col) % 2 === 0; // timing pattern
  return next() < 0.5; // data noise
}

export default function QRCode({ value, size = 208 }) {
  const random = createRandom(hashString(value));
  const cell = size / MODULES;

  const rects = [];
  for (let row = 0; row < MODULES; row++) {
    for (let col = 0; col < MODULES; col++) {
      if (isDark(row, col, random)) {
        rects.push(<rect key={`${row}-${col}`} x={col * cell} y={row * cell} width={cell} height={cell} />);
      }
    }
  }

  return (
    <svg className="qr-code" viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="QR code">
      <rect x="0" y="0" width={size} height={size} fill="#fff" />
      <g fill="#0a0a0a">{rects}</g>
    </svg>
  );
}
