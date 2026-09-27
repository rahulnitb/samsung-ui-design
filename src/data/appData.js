// Placeholder app tiles: a short `label` drawn on a coloured badge.
// To use a real logo, add `icon: "/icons/<app>.png"` (file in /public) and it replaces the label.
const app = (id, name, label, background, foreground = '#fff') => ({
  id,
  name,
  label,
  background,
  foreground,
});

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
  app('smartthings', 'SmartThings', 'ST', 'linear-gradient(135deg, #3aa0ff, #1560d8)'),
  app('tvplus', 'Samsung TV Plus', 'TV+', 'linear-gradient(135deg, #2746e8, #0b1a7a)'),
  app('livetv', 'Live TV', 'LIVE', 'linear-gradient(135deg, #ff4d5e, #b3122a)'),
  app('netflix', 'Netflix', 'N', '#0b0b0b', '#e50914'),
  app('prime', 'Prime Video', 'prime', 'linear-gradient(135deg, #1aa7ec, #0b6fb8)'),
  app('disney', 'Disney+', 'D+', 'linear-gradient(135deg, #0e1f5b, #1d6fd1)'),
  app('appletv', 'Apple TV', 'tv', 'linear-gradient(135deg, #3a3a3e, #0c0c0d)'),
  app('youtube', 'YouTube', '▶', '#ff0033'),
  app('youtubetv', 'YouTube TV', 'YT TV', '#f4f4f4', '#ff0033'),
  app('sweettv', 'Sweet TV', 'sweet', 'linear-gradient(135deg, #ff8a3d, #ff3d7f)'),
  app('now', 'NOW', 'NOW', 'linear-gradient(135deg, #00e0c6, #009e8c)', '#04201c'),
];

export const installedApps = [
  ...launcherApps,
  app('gallery', 'Gallery', 'GAL', 'linear-gradient(135deg, #ff9a3d, #e8453c)'),
  app('internet', 'Internet', 'WWW', 'linear-gradient(135deg, #7c5cff, #3b2bb8)'),
  app('music', 'Music', '♪', 'linear-gradient(135deg, #ff5fa2, #b0246b)'),
  app('gaminghub', 'Gaming Hub', 'GH', 'linear-gradient(135deg, #1ed3a1, #0a7a5c)'),
  app('health', 'Samsung Health', 'SH', 'linear-gradient(135deg, #3ddc84, #108a48)'),
  app('artstore', 'Art Store', 'ART', 'linear-gradient(135deg, #f7d9a8, #b98a4e)', '#2a1a06'),
  app('ambient', 'Ambient Mode', 'AMB', 'linear-gradient(135deg, #4b5568, #1e2430)'),
];

export const recommendedApps = [
  app('plex', 'Plex', 'PLEX', '#1f1f1f', '#e5a00d'),
  app('twitch', 'Twitch', 'TW', 'linear-gradient(135deg, #9146ff, #5a1fcf)'),
  app('tubi', 'Tubi', 'tubi', 'linear-gradient(135deg, #7408ff, #3a0a8c)'),
  app('pluto', 'Pluto TV', 'PLUTO', '#111', '#fff200'),
  app('crunchyroll', 'Crunchyroll', 'CR', 'linear-gradient(135deg, #ff7a1a, #e85d04)'),
  app('mubi', 'MUBI', 'MUBI', '#0e1a2b'),
  app('spotify', 'Spotify', 'SP', '#121212', '#1ed760'),
  app('applemusic', 'Apple Music', '♫', 'linear-gradient(135deg, #ff5a6f, #fa233b)'),
  app('ted', 'TED', 'TED', '#e62b1e'),
  app('fitness', 'Fitness+', 'FIT', 'linear-gradient(135deg, #b3ff3d, #4fbf00)', '#102600'),
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
