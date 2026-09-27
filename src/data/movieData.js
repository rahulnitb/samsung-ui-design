// Mock catalogue. Artwork is generated from `palette`; set `image` to use a real poster/still.
const title = (id, name, year, genre, rating, duration, palette) => ({
  id,
  title: name,
  year,
  genre,
  rating,
  duration,
  palette,
  image: null,
});

export const movies = {
  lateLounge: title('late-lounge', 'The Late Lounge', 2025, 'Talk Show', '13+', 'Live nightly', ['#2a0f0a', '#ff9a5a', '#5a1e2a']),
  yellowstone: title('yellowstone', 'Yellowstone', 2024, 'Western Drama', '16+', '5 Seasons', ['#2a1408', '#e0923f', '#5c2410']),
  grandSoleil: title('grand-soleil', 'The Grand Soleil', 2023, 'Romance', '13+', '1h 58m', ['#240b2e', '#ffb45a', '#ff5f6d']),
  lastKingdom: title('last-kingdom', 'The Last Kingdom', 2022, 'Historical Action', '18+', '5 Seasons', ['#0d1820', '#8db6d4', '#34505f']),
  strangerThings: title('stranger-things', 'Stranger Things', 2025, 'Sci-Fi Horror', '16+', '5 Seasons', ['#12000a', '#ff2d3c', '#2c0b3a']),
  darkKnight: title('dark-knight', 'The Dark Knight', 2008, 'Action', '13+', '2h 32m', ['#04060c', '#4a6a9c', '#141d2c']),
  inception: title('inception', 'Inception', 2010, 'Sci-Fi Thriller', '13+', '2h 28m', ['#08131e', '#6ec4e0', '#23405a']),
  interstellar: title('interstellar', 'Interstellar', 2014, 'Sci-Fi', '13+', '2h 49m', ['#020309', '#f3c872', '#1a2448']),
  missionImpossible: title('mission-impossible', 'Mission: Impossible', 2023, 'Action', '13+', '2h 43m', ['#180b04', '#ff7a1a', '#3b1406']),
  oceanDrift: title('ocean-drift', 'Ocean Drift', 2024, 'Documentary', 'All', '1h 32m', ['#021520', '#27c1c9', '#07405a']),
  midnightCircuit: title('midnight-circuit', 'Midnight Circuit', 2025, 'Thriller', '16+', '2 Seasons', ['#0a0616', '#b04dff', '#1d1450']),
  northernLights: title('northern-lights', 'Northern Lights', 2023, 'Nature', 'All', '58m', ['#010a10', '#4dffb0', '#0f2d4a']),
  paperPlanes: title('paper-planes', 'Paper Planes', 2022, 'Family', '7+', '1h 36m', ['#1b1406', '#ffd166', '#ef476f']),
  neonTokyo: title('neon-tokyo', 'Neon Tokyo', 2025, 'Anime', '13+', '1 Season', ['#10021a', '#ff4fd8', '#2a2dff']),
  crownJewel: title('crown-jewel', 'The Crown Jewel', 2024, 'Heist', '13+', '2h 05m', ['#0d0a02', '#e8c15a', '#4a3606']),
  silentHarbor: title('silent-harbor', 'Silent Harbor', 2023, 'Mystery', '16+', '3 Seasons', ['#05090d', '#8aa4b8', '#1f2c38']),
  summit: title('summit', 'Summit', 2024, 'Sports', 'All', '1h 44m', ['#0a0d12', '#e8eef5', '#3c5b7a']),
};

export const allTitles = Object.values(movies);

const m = movies;

// Sections on the "For You" page.
// "Now Playing" and "Recommended for You" share the first card row (as on the TV);
// the other two appear further down. `provider` shows a small channel badge.
export const forYouSections = {
  nowPlaying: {
    title: 'Now Playing',
    items: [{ ...m.lateLounge, badge: 'LIVE', provider: 'TV+', meta: 'Live · Talk Show' }],
  },
  recommended: {
    title: 'Recommended for You',
    items: [
      { ...m.yellowstone, provider: 'TV+' },
      { ...m.grandSoleil, provider: 'TV+' },
      m.lastKingdom,
      m.strangerThings,
      m.inception,
      { ...m.oceanDrift, provider: 'TV+' },
      m.darkKnight,
      m.interstellar,
      m.missionImpossible,
    ],
  },
  continueWatching: {
    title: 'Continue Watching',
    items: [
      { ...m.strangerThings, progress: 0.62, meta: 'S4 E7 · 31m left' },
      { ...m.inception, progress: 0.35, meta: '1h 36m left' },
      { ...m.lastKingdom, progress: 0.8, meta: 'S2 E5 · 12m left' },
      { ...m.northernLights, progress: 0.18, meta: '47m left' },
      { ...m.missionImpossible, progress: 0.5, meta: '1h 21m left' },
    ],
  },
  popular: {
    title: 'Popular Movies',
    items: [
      m.darkKnight,
      m.missionImpossible,
      m.interstellar,
      m.inception,
      m.grandSoleil,
      m.crownJewel,
      m.paperPlanes,
      m.summit,
      m.midnightCircuit,
      m.silentHarbor,
    ],
  },
};
