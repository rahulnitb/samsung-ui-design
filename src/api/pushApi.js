import { allTitles } from '../data/movieData.js';
import { liveCategories } from '../data/liveData.js';
import { installedApps, recommendedApps } from '../data/appData.js';
import { randomId } from '../utils/random.js';

// Dummy "incoming share" content — a small mixed batch (movies/channels/apps), as if pushed
// down from the paired companion device over the websocket. There's no real push scheduling
// here (see the debug overlay's "Simulate incoming share" button) — call this directly to test.
const DELAY_MS = 400;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const allChannels = liveCategories.flatMap((category) => category.channels);

function dedupeById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

const allApps = dedupeById([...installedApps, ...recommendedApps]);

function sample(list, resultType, count) {
  const pool = [...list];
  const picks = [];
  while (picks.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    picks.push({ ...pool.splice(index, 1)[0], resultType });
  }
  return picks;
}

export async function getIncomingShare() {
  await wait(DELAY_MS);
  const items = [...sample(allTitles, 'movies', 2), ...sample(allChannels, 'channels', 1), ...sample(allApps, 'apps', 1)];
  return { id: randomId('push'), items };
}
