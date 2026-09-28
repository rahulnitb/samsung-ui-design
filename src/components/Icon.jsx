// Small stroke icon set (24×24 grid). Kept minimal on purpose.
const ICONS = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9v12h5v-6h4v6h5V9" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4.5 4.5" />
    </>
  ),
  tv: (
    <>
      <rect x="2.5" y="5" width="19" height="13" rx="2" />
      <path d="M8 21h8" />
    </>
  ),
  apps: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </>
  ),
  media: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M10 8.5v7l6-3.5z" fill="currentColor" />
    </>
  ),
  smartthings: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <path d="M10.8 7.2 6.3 15.8M13.2 7.2l4.5 8.6M7.5 18h9" />
    </>
  ),
  settings: (
    <>
      <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
      <circle cx="15" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    </>
  ),
  back: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  backspace: (
    <>
      <path d="M21 5H9l-6 7 6 7h12z" />
      <path d="m12 9 6 6M18 9l-6 6" />
    </>
  ),
  play: <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  restart: (
    <>
      <path d="M4 12a8 8 0 1 0 2.6-5.9" />
      <path d="M4 4v5h5" />
    </>
  ),
  space: <path d="M4 10v4h16v-4" />,
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21M8.5 21h7" />
    </>
  ),
  wifi: (
    <>
      <path d="M4 9.5a12 12 0 0 1 16 0" />
      <path d="M7 13a7.5 7.5 0 0 1 10 0" />
      <path d="M10 16.5a3 3 0 0 1 4 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="6" y="6" width="1" height="1" fill="currentColor" stroke="none" />
      <rect x="17" y="6" width="1" height="1" fill="currentColor" stroke="none" />
      <rect x="6" y="17" width="1" height="1" fill="currentColor" stroke="none" />
      <rect x="14.5" y="14.5" width="2.5" height="2.5" fill="currentColor" stroke="none" />
      <rect x="18.5" y="14.5" width="2.5" height="2.5" fill="currentColor" stroke="none" />
      <rect x="14.5" y="18.5" width="2.5" height="2.5" fill="currentColor" stroke="none" />
      <rect x="18.5" y="18.5" width="2.5" height="2.5" fill="currentColor" stroke="none" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 4 5.7 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.7-4-9s1.5-6.5 4-9Z" />
    </>
  ),
  musicNote: (
    <>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="m4 17 5-5 3.5 3.5L17 10l4 5.5" />
    </>
  ),
  heart: <path d="M12 20.5S3.5 15 3.5 9.2C3.5 6 6 4 8.7 4c1.7 0 3 .8 3.8 2.1C13.3 4.8 14.6 4 16.3 4 19 4 21.5 6 21.5 9.2 21.5 15 12 20.5 12 20.5Z" />,
  gamepad: (
    <>
      <rect x="2.5" y="8" width="19" height="10" rx="5" />
      <path d="M7 11v4M5 13h4" />
      <circle cx="15.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="14" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.8 2-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8Z" />
      <circle cx="7.5" cy="10.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="11" cy="7" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  graduationCap: (
    <>
      <path d="m2 9 10-4.5L22 9l-10 4.5L2 9Z" />
      <path d="M6 11.5V17c0 1.5 2.5 3 6 3s6-1.5 6-3v-5.5" />
      <path d="M22 9v6" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="9" width="18" height="12" rx="1.5" />
      <path d="M3 13h18" />
      <path d="M12 9v12" />
      <path d="M12 9c-1-3-3-5-5-5-1.7 0-3 1.1-3 2.5S5.3 9 7 9Z" />
      <path d="M12 9c1-3 3-5 5-5 1.7 0 3 1.1 3 2.5S18.7 9 17 9Z" />
    </>
  ),
  check: <path d="M4 12.5 9.5 18 20 6" />,
  share: (
    <>
      <path d="M12 15V3M12 3 8 7M12 3l4 4" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
      <path d="m6 6 2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    </>
  ),
};

export default function Icon({ name, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}
