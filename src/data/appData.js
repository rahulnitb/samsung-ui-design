import { brandIcons } from './brandIcons.js';
import { stockImage } from '../utils/stockImage.js';

// Placeholder app tiles: a short `label` drawn on a coloured badge.
// To use a real logo: add `icon: "/icons/<app>.png"` for an image file (in /public),
// or `iconSvg: brandIcons.<slug>` for one of the fetched brand marks below — either
// replaces the text label. `withBrand` is a small helper for the latter.
const app = (id, name, label, background, foreground = '#fff') => ({
  id,
  name,
  label,
  background,
  foreground,
});

const withBrand = (appEntry, slug) => ({ ...appEntry, iconSvg: brandIcons[slug] });

// For first-party Samsung features / generic apps with no real brand mark to fetch,
// draw a fitting stroke glyph (see components/Icon.jsx) instead of a plain text badge.
const withGlyph = (appEntry, glyphIcon) => ({ ...appEntry, glyphIcon });

// Bixby is not a streaming app — selecting it opens the voice-search overlay instead
// of an "app launch" screen (see navigation/navReducer.js). `isVoiceAssistant` flags
// that for AppIcon, which draws a mic glyph instead of the usual text label.
export const bixbyApp = {
  id: 'bixby',
  name: 'Bixby',
  label: 'B',
  background: 'linear-gradient(135deg, #29c6ff, #7b5cff 55%, #c23cff)',
  foreground: '#fff',
  isVoiceAssistant: true,
};

// Bottom launcher on the "For You" page.
export const launcherApps = [
  bixbyApp,
  withGlyph(app('smartthings', 'SmartThings', 'ST', 'linear-gradient(135deg, #3aa0ff, #1560d8)'), 'smartthings'),
  withBrand(app('tvplus', 'Samsung TV Plus', 'TV+', '#fff', '#1428a0'), 'samsung'),
  app('livetv', 'Live TV', 'LIVE', 'linear-gradient(135deg, #ff4d5e, #b3122a)'),
  withBrand(app('netflix', 'Netflix', 'N', '#0b0b0b', '#e50914'), 'netflix'),
  withBrand(app('prime', 'Prime Video', 'prime', '#0b1a24', '#00a8e1'), 'primevideo'),
  app('disney', 'Disney+', 'D+', 'linear-gradient(135deg, #0e1f5b, #1d6fd1)'),
  withBrand(app('appletv', 'Apple TV', 'tv', '#0b0b0c', '#fff'), 'appletv'),
  withBrand(app('youtube', 'YouTube', '▶', '#0b0b0c', '#ff0000'), 'youtube'),
  withBrand(app('youtubetv', 'YouTube TV', 'YT TV', '#f4f4f4', '#ff0033'), 'youtubetv'),
  app('sweettv', 'Sweet TV', 'sweet', 'linear-gradient(135deg, #ff8a3d, #ff3d7f)'),
  app('now', 'NOW', 'NOW', 'linear-gradient(135deg, #00e0c6, #009e8c)', '#04201c'),
];

export const installedApps = [
  ...launcherApps,
  withGlyph(app('gallery', 'Gallery', 'GAL', 'linear-gradient(135deg, #ff9a3d, #e8453c)'), 'image'),
  withGlyph(app('internet', 'Internet', 'WWW', 'linear-gradient(135deg, #7c5cff, #3b2bb8)'), 'globe'),
  withGlyph(app('music', 'Music', '♪', 'linear-gradient(135deg, #ff5fa2, #b0246b)'), 'musicNote'),
  withGlyph(app('gaminghub', 'Gaming Hub', 'GH', 'linear-gradient(135deg, #1ed3a1, #0a7a5c)'), 'gamepad'),
  withGlyph(app('health', 'Samsung Health', 'SH', 'linear-gradient(135deg, #3ddc84, #108a48)'), 'heart'),
  withGlyph(app('artstore', 'Art Store', 'ART', 'linear-gradient(135deg, #f7d9a8, #b98a4e)', '#2a1a06'), 'palette'),
  withGlyph(app('ambient', 'Ambient Mode', 'AMB', 'linear-gradient(135deg, #4b5568, #1e2430)'), 'sparkle'),
];

export const recommendedApps = [
  withBrand(app('plex', 'Plex', 'PLEX', '#1f1f1f', '#e5a00d'), 'plex'),
  withBrand(app('twitch', 'Twitch', 'TW', '#0e0e10', '#9146ff'), 'twitch'),
  withBrand(app('tubi', 'Tubi', 'tubi', '#0b0b0c', '#ff5a1f'), 'tubi'),
  app('pluto', 'Pluto TV', 'PLUTO', '#111', '#fff200'),
  withBrand(app('crunchyroll', 'Crunchyroll', 'CR', '#0d0d0d', '#ff640a'), 'crunchyroll'),
  withBrand(app('mubi', 'MUBI', 'MUBI', '#0e1a2b', '#fff'), 'mubi'),
  withBrand(app('spotify', 'Spotify', 'SP', '#121212', '#1ed760'), 'spotify'),
  withBrand(app('applemusic', 'Apple Music', '♫', '#0b0b0c', '#fa233b'), 'applemusic'),
  withBrand(app('ted', 'TED', 'TED', '#0d0d0d', '#e62b1e'), 'ted'),
  withGlyph(app('fitness', 'Fitness+', 'FIT', 'linear-gradient(135deg, #b3ff3d, #4fbf00)', '#102600'), 'heart'),
];

// The Apps page's top two rows sit side by side under one "Recommended" /
// "Provided by Samsung" heading — small white/coloured square icons, matching
// Samsung's own Smart Hub Apps tab.
export const recommendedRow = [
  withBrand(app('alexa', 'Alexa', 'alexa', '#fff', '#00caff'), 'amazonalexa'),
  // No distinct "Sony LIV" mark in the icon set used — Sony's own corporate logo
  // stands in as the closest real brand match (Sony LIV is a Sony sub-brand).
  withBrand(app('sonyliv', 'Sony LIV', 'LIV', '#000', '#fff'), 'sony'),
  withGlyph(app('gallery2', 'Gallery', 'GAL', 'linear-gradient(135deg, #ff5fa2, #d6246b)'), 'image'),
  withGlyph(app('eduhub', 'Samsung Education Hub', 'EDU', '#fff', '#1428a0'), 'graduationCap'),
];

// Reuses the launcher's SmartThings/Bixby entries so they stay the same feature
// everywhere they appear (SmartThings toasts, Bixby opens the voice popup).
export const samsungRow = [
  withGlyph(app('internet2', 'Internet', 'WWW', 'linear-gradient(135deg, #4d6bff, #1c2ea0)'), 'globe'),
  withGlyph(app('promotion', 'Samsung Promotion', 'PRO', 'linear-gradient(135deg, #3aa0ff, #0b3d78)'), 'gift'),
  launcherApps.find((item) => item.id === 'smartthings'),
  bixbyApp,
];

// "Editor's Choice": bigger promo banners, each fronting one app. `name`/`background`/
// `foreground`/`label` make these valid app-launch targets too (see appMedia in
// navReducer.js), same as any other app tile.
export const editorsChoice = [
  {
    id: 'jiocinema-promo',
    image: stockImage('jiocinema-promo', 540, 340),
    name: 'JioCinema',
    label: 'Jio',
    background: 'linear-gradient(135deg, #6a0dad, #2c0a4a)',
    foreground: '#fff',
    tagline: 'Record breaking, jaw dropping, Reality Shows.',
    palette: ['#2c0a4a', '#a349ff', '#12021f'],
  },
  {
    id: 'spotify-promo',
    image: stockImage('spotify-promo', 540, 340),
    name: 'Spotify',
    label: 'SP',
    background: '#121212',
    foreground: '#1ed760',
    iconSvg: brandIcons.spotify,
    tagline: 'Release Radar — your heavy rotation, refreshed.',
    palette: ['#0a0a0a', '#1ed760', '#04210f'],
  },
  {
    id: 'aha-promo',
    image: stockImage('aha-promo', 540, 340),
    name: 'aha',
    label: 'aha',
    background: 'linear-gradient(135deg, #ff7a1a, #b3390a)',
    foreground: '#fff',
    tagline: 'New releases every Friday.',
    palette: ['#3a1406', '#ff9a3d', '#160702'],
  },
  {
    id: 'alexa-promo',
    image: stockImage('alexa-promo', 540, 340),
    name: 'Amazon Alexa',
    label: 'alexa',
    background: '#fff',
    foreground: '#00caff',
    iconSvg: brandIcons.amazonalexa,
    tagline: 'Ask, play and control your TV hands-free.',
    palette: ['#04101f', '#3aa0ff', '#020a14'],
  },
  {
    id: 'xstream-promo',
    image: stockImage('xstream-promo', 540, 340),
    name: 'Xstream Play',
    label: 'XP',
    background: '#1a0a0c',
    foreground: '#ff3b4a',
    iconSvg: brandIcons.airtel,
    tagline: 'Secured by Knox — explore now & trending.',
    palette: ['#2a0508', '#ff3b4a', '#100202'],
  },
];

export const appCategories = [
  { id: 'games', name: 'Games', count: 128, background: 'linear-gradient(135deg, #1ed3a1, #0a4f6b)' },
  { id: 'entertainment', name: 'Entertainment', count: 96, background: 'linear-gradient(135deg, #ff4d5e, #5c0b3a)' },
  { id: 'kids', name: 'Kids', count: 42, background: 'linear-gradient(135deg, #ffd166, #ef476f)' },
  { id: 'music', name: 'Music', count: 37, background: 'linear-gradient(135deg, #b04dff, #2a2dff)' },
  { id: 'sports', name: 'Sports', count: 29, background: 'linear-gradient(135deg, #3aa0ff, #0b2b6b)' },
  { id: 'news', name: 'News', count: 24, background: 'linear-gradient(135deg, #8aa4b8, #1f2c38)' },
  { id: 'lifestyle', name: 'Lifestyle', count: 51, background: 'linear-gradient(135deg, #f7a072, #8c3b2a)' },
  { id: 'education', name: 'Education', count: 33, background: 'linear-gradient(135deg, #4dffb0, #0f4a3a)' },
];
