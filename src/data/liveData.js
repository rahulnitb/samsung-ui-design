// Mock live channels. Programme slots are created relative to page load so that
// progress bars and start/end times always look "live".
const MINUTE = 60 * 1000;
const loadedAt = Date.now();

const channel = (id, number, name, short, program, startedMinutesAgo, durationMinutes, palette) => ({
  id,
  number,
  name,
  short,
  program,
  start: loadedAt - startedMinutesAgo * MINUTE,
  end: loadedAt - startedMinutesAgo * MINUTE + durationMinutes * MINUTE,
  palette,
});

export const liveCategories = [
  {
    id: 'news',
    title: 'News',
    channels: [
      channel('wn24', 101, 'World News 24', 'WN24', 'Global Headlines', 18, 60, ['#06101c', '#3d8bff', '#0b2448']),
      channel('bizday', 102, 'Business Day', 'BIZ', 'Markets Tonight', 40, 60, ['#081208', '#3ddc84', '#0d3a1e']),
      channel('metro', 103, 'Metro Local', 'METRO', 'City Report', 5, 30, ['#140a04', '#ff9a3d', '#3a1a06']),
      channel('politics', 104, 'Capitol Live', 'CAP', 'The Debate Hour', 25, 60, ['#0c0a14', '#8a7dff', '#241a4a']),
      channel('weather', 105, 'Weather Now', 'WX', 'Storm Watch', 12, 30, ['#04121a', '#4dd2ff', '#0a3148']),
    ],
  },
  {
    id: 'sports',
    title: 'Sports',
    channels: [
      channel('arena', 201, 'Arena Sports', 'ARENA', 'Championship Football', 55, 120, ['#050d05', '#5cff5c', '#0d3a12']),
      channel('court', 202, 'Courtside', 'CRT', 'Pro Basketball Live', 30, 150, ['#140800', '#ff7a1a', '#3b1406']),
      channel('pitch', 203, 'Pitch TV', 'PITCH', 'Cricket: Test Match Day 2', 190, 420, ['#06140a', '#b3ff3d', '#1f3a0a']),
      channel('motor', 204, 'Motor Max', 'MOTO', 'Grand Prix Qualifying', 20, 90, ['#140404', '#ff2d3c', '#3a0a0a']),
      channel('fight', 205, 'Fight Night', 'FN', 'Title Bout Countdown', 8, 60, ['#0a0a0a', '#e8c15a', '#3a2c06']),
    ],
  },
  {
    id: 'movies',
    title: 'Movies',
    channels: [
      channel('cinema1', 301, 'Cinema One', 'CIN1', 'Interstellar', 70, 169, ['#020309', '#f3c872', '#1a2448']),
      channel('action', 302, 'Action Max', 'ACT', 'Mission: Impossible', 35, 163, ['#180b04', '#ff7a1a', '#3b1406']),
      channel('classic', 303, 'Classic Films', 'CLS', 'The Dark Knight', 100, 152, ['#04060c', '#4a6a9c', '#141d2c']),
      channel('romance', 304, 'Heartline', 'HRT', 'The Grand Soleil', 15, 118, ['#240b2e', '#ffb45a', '#ff5f6d']),
      channel('thriller', 305, 'Night Screen', 'NS', 'Inception', 45, 148, ['#08131e', '#6ec4e0', '#23405a']),
    ],
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    channels: [
      channel('drama', 401, 'Drama Central', 'DRMA', 'Yellowstone', 22, 60, ['#2a1408', '#e0923f', '#5c2410']),
      channel('comedy', 402, 'Laugh Track', 'LOL', 'Stand-Up Tonight', 10, 30, ['#141000', '#ffe14d', '#3a3006']),
      channel('reality', 403, 'Real Life', 'REAL', 'Kitchen Masters', 28, 60, ['#140614', '#ff4fd8', '#3a0a3a']),
      channel('history', 404, 'History Now', 'HIST', 'The Last Kingdom', 33, 60, ['#0d1820', '#8db6d4', '#34505f']),
      channel('music', 405, 'Hit Music', 'HITS', 'Top 40 Countdown', 14, 60, ['#0a0616', '#b04dff', '#1d1450']),
    ],
  },
  {
    id: 'kids',
    title: 'Kids',
    channels: [
      channel('toons', 501, 'Toon Town', 'TOON', 'Paper Planes', 40, 96, ['#1b1406', '#ffd166', '#ef476f']),
      channel('junior', 502, 'Junior', 'JR', 'Alphabet Adventures', 6, 25, ['#04141a', '#4dd2ff', '#0a3148']),
      channel('explore', 503, 'Explorers', 'EXP', 'Ocean Drift', 50, 92, ['#021520', '#27c1c9', '#07405a']),
      channel('anime', 504, 'Anime Zone', 'ANI', 'Neon Tokyo', 12, 24, ['#10021a', '#ff4fd8', '#2a2dff']),
      channel('science', 505, 'Science Kids', 'SCI', 'Northern Lights', 20, 58, ['#010a10', '#4dffb0', '#0f2d4a']),
    ],
  },
];
