import { allTitles } from '../data/movieData.js';
import { liveCategories } from '../data/liveData.js';
import { installedApps, recommendedApps } from '../data/appData.js';

const allChannels = liveCategories.flatMap((category) => category.channels);

// installedApps already contains the launcher apps; recommendedApps adds the rest of the catalogue.
const allApps = dedupeById([...installedApps, ...recommendedApps]);

function dedupeById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

const includes = (text, query) => text.toLowerCase().includes(query);

// The full catalogue, not a short top-10 — the row scrolls (by focus, like every
// other row) rather than needing to be trimmed down to fit.
export function popularTitles() {
  return allTitles;
}

/* ---------- Fallback "suggested" results ---------- */
// When a query matches nothing in the mock catalogue, generate a small, deterministic
// set of placeholder titles built from the query itself, so the search never dead-ends
// on a blank screen — closer to how a real streaming search surfaces related content
// instead of a plain "no results" page.

const SUGGESTION_TEMPLATES = [
  { suffix: 'Rising', genre: 'Action' },
  { suffix: 'Chronicles', genre: 'Fantasy' },
  { suffix: 'Uncharted', genre: 'Adventure' },
  { suffix: 'After Hours', genre: 'Drama' },
  { suffix: 'Unlimited', genre: 'Sci-Fi' },
  { suffix: 'Reloaded', genre: 'Thriller' },
];

const SUGGESTION_PALETTES = [
  ['#1a1408', '#e8c15a', '#8c3b2a'],
  ['#081226', '#2f6bff', '#ff6a1f'],
  ['#050818', '#6a4dff', '#02030a'],
  ['#2a1710', '#ffb15a', '#0d0603'],
  ['#05140a', '#5cff5c', '#ff3b4a'],
  ['#140a2e', '#b48cff', '#0a0618'],
];

const SUGGESTION_YEARS = [2021, 2022, 2023, 2024, 2025];
const SUGGESTION_RATINGS = ['13+', '16+', 'All', '18+'];

const titleCase = (text) => text.replace(/\S+/g, (word) => word[0].toUpperCase() + word.slice(1));

function hashString(text) {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(value);
}

// Deterministic per query: the same search always suggests the same "titles".
export function suggestedResults(query) {
  const base = titleCase(query.trim());
  const seed = hashString(base.toLowerCase());
  const slug = base.toLowerCase().replace(/\s+/g, '-');

  return SUGGESTION_TEMPLATES.map((template, index) => {
    const n = seed + index * 97;
    return {
      id: `suggested-${slug}-${index}`,
      title: `${base} ${template.suffix}`,
      badge: 'Suggested',
      genre: template.genre,
      year: SUGGESTION_YEARS[n % SUGGESTION_YEARS.length],
      rating: SUGGESTION_RATINGS[(n >> 3) % SUGGESTION_RATINGS.length],
      duration: `${1 + (n % 2)}h ${10 + (n % 40)}m`,
      palette: SUGGESTION_PALETTES[n % SUGGESTION_PALETTES.length],
      image: null,
    };
  });
}

/**
 * Universal search: one query matched across every kind of content on the TV,
 * grouped by type — the way Samsung's own Smart Hub search groups results into
 * Apps / Videos / etc. rather than a single flat list.
 */
export function searchAll(query) {
  const q = query.trim().toLowerCase();
  if (!q) return { movies: [], channels: [], apps: [] };
  return {
    movies: allTitles.filter((item) => includes(item.title, q) || includes(item.genre, q)),
    channels: allChannels.filter((channel) => includes(channel.name, q) || includes(channel.program, q)),
    apps: allApps.filter((app) => includes(app.name, q)),
  };
}

/**
 * A single flat row of results across every content type, each item tagged with
 * `resultType` so a renderer can pick the right card. Used by compact, single-row
 * surfaces (like the Bixby result popup) where a full grouped-by-type layout would
 * be too much; falls back to `suggestedResults` when nothing real matches.
 */
export function mergedSearchResults(query, limit) {
  const { movies, channels, apps } = searchAll(query);
  const tagged = [
    ...movies.map((item) => ({ ...item, resultType: 'movies' })),
    ...channels.map((item) => ({ ...item, resultType: 'channels' })),
    ...apps.map((item) => ({ ...item, resultType: 'apps' })),
  ];
  const items = tagged.length > 0 ? tagged : suggestedResults(query).map((item) => ({ ...item, resultType: 'movies' }));
  return items.slice(0, limit);
}
