import { forYouSections } from '../data/movieData.js';
import {
  launcherApps,
  installedApps,
  recommendedApps,
  appCategories,
  recommendedRow,
  samsungRow,
  editorsChoice,
} from '../data/appData.js';
import { liveCategories } from '../data/liveData.js';
import { searchAll, popularTitles, suggestedResults } from '../utils/search.js';

/*
 * Every focusable screen is described as an ordered list of rows (top to bottom).
 * - `kind` tells the page how to render the row and the reducer what Enter does.
 * - `items` are the focusable elements, left to right.
 * - optional `widths` enable spatially aligned up/down movement (see grid.js).
 * Pages render from these same descriptors, so the navigation model and the
 * screen can never disagree about what is where.
 */

export const PAGES = [
  { id: 'forYou', label: 'For You' },
  { id: 'live', label: 'Live' },
  { id: 'apps', label: 'Apps' },
];

export const APPS_GRID_COLUMNS = 6;

export const pageIndex = (page) => PAGES.findIndex((entry) => entry.id === page);

const tabsRow = { id: 'tabs', kind: 'tabs', items: PAGES };

function gridRows(section, items, columns) {
  const rows = [];
  for (let start = 0; start < items.length; start += columns) {
    const slice = items.slice(start, start + columns);
    rows.push({
      id: `${section.id}-${start / columns}`,
      kind: 'appGrid',
      section,
      items: slice,
      widths: slice.map(() => 1),
    });
  }
  return rows;
}

const { nowPlaying, recommended, continueWatching, popular } = forYouSections;

const PAGE_ROWS = {
  // Home screen, in on-screen order: promo hero, tab pill, featured cards, apps.
  forYou: [
    { id: 'hero', kind: 'hero', items: [{ id: 'hero-cta' }] },
    tabsRow,
    {
      id: 'featured',
      kind: 'cards',
      variant: 'feature',
      items: [...nowPlaying.items, ...recommended.items],
      // group headings shown above the first card of each group
      labels: { 0: nowPlaying.title, [nowPlaying.items.length]: recommended.title },
    },
    { id: 'appLauncher', kind: 'apps', items: launcherApps },
    { id: 'continueWatching', kind: 'cards', title: continueWatching.title, variant: 'landscape', items: continueWatching.items },
    { id: 'popular', kind: 'cards', title: popular.title, variant: 'poster', items: popular.items },
  ],
  live: [
    { id: 'liveHero', kind: 'banner', items: [] },
    tabsRow,
    ...liveCategories.map((category) => ({
      id: `live-${category.id}`,
      kind: 'channels',
      title: category.title,
      items: category.channels,
    })),
  ],
  // Matches Samsung's own Apps tab: illustrated banner, tab pill, a "Recommended" /
  // "Provided by Samsung" row (one row, two labelled groups), Editor's Choice promo
  // banners, then the fuller Installed Apps / More to Explore / Categories browsing.
  apps: [
    { id: 'appsHero', kind: 'banner', items: [] },
    tabsRow,
    {
      id: 'appsFeatured',
      kind: 'apps',
      items: [...recommendedRow, ...samsungRow],
      groupLabels: { 0: 'Recommended', [recommendedRow.length]: 'Provided by Samsung' },
      groupStart: recommendedRow.length,
    },
    { id: 'editorsChoice', kind: 'editorsChoice', title: "Editor's Choice", items: editorsChoice },
    ...gridRows({ id: 'installed', title: 'Installed Apps' }, installedApps, APPS_GRID_COLUMNS),
    ...gridRows({ id: 'moreApps', title: 'More to Explore' }, recommendedApps, APPS_GRID_COLUMNS),
    { id: 'appCategories', kind: 'categories', title: 'Categories', items: appCategories },
  ],
};

export const getPageRows = (page) => PAGE_ROWS[page];
export const tabsRowIndex = (page) => PAGE_ROWS[page].findIndex((row) => row.kind === 'tabs');

/* ---------- Search overlay ---------- */

export const KEYBOARD_COLUMNS = 10;

const charKeys = (chars) =>
  chars.split('').map((char) => ({ id: `key-${char}`, type: 'char', value: char, label: char.toUpperCase() }));

export const KEYBOARD_LAYOUT = [
  charKeys('abcdefghij'),
  charKeys('klmnopqrst'),
  charKeys('uvwxyz1234'),
  charKeys("567890-'.&"),
  [
    { id: 'key-space', type: 'space', label: 'Space', icon: 'space', width: 4 },
    { id: 'key-delete', type: 'delete', label: 'Delete', icon: 'backspace', width: 3 },
    { id: 'key-submit', type: 'submit', label: 'Search', icon: 'search', width: 3 },
  ],
];

const searchHeaderRow = {
  id: 'search-header',
  kind: 'header',
  items: [
    { id: 'back', type: 'back', label: 'Back', icon: 'back' },
    { id: 'clear', type: 'clear', label: 'Clear', icon: 'close' },
  ],
  // Back sits above the left half of the keyboard, Clear above the right half.
  widths: [KEYBOARD_COLUMNS / 2, KEYBOARD_COLUMNS / 2],
};

const keyboardRows = KEYBOARD_LAYOUT.map((keys, index) => ({
  id: `keyboard-${index}`,
  kind: 'keys',
  items: keys,
  widths: keys.map((key) => key.width ?? 1),
}));

export const SEARCH_FIRST_KEY_ROW = 1;
// Row index where results begin: fixed, since the header + keyboard never change shape.
export const SEARCH_RESULTS_ROW = SEARCH_FIRST_KEY_ROW + keyboardRows.length;

// A results row only exists when it has at least one match, so the results section of
// the row list can grow/shrink/reorder as the query changes — callers must not assume
// a fixed number of result rows (see setQuery in navReducer.js).
const resultsRow = (id, resultType, title, items) => ({ id, kind: 'results', resultType, title, items });

function buildResultRows(query) {
  const trimmed = query.trim();
  if (!trimmed) return [resultsRow('search-popular', 'movies', 'Popular Searches', popularTitles())];

  const { movies, channels, apps } = searchAll(query);
  const rows = [];
  if (movies.length) rows.push(resultsRow('search-movies', 'movies', 'Movies & TV Shows', movies));
  if (channels.length) rows.push(resultsRow('search-channels', 'channels', 'Live Channels', channels));
  if (apps.length) rows.push(resultsRow('search-apps', 'apps', 'Apps', apps));

  // Nothing in the mock catalogue matched — suggest some placeholder titles built from
  // the query itself rather than leaving the results panel empty.
  if (rows.length === 0) {
    rows.push(resultsRow('search-suggested', 'movies', `Suggested for “${trimmed}”`, suggestedResults(trimmed)));
  }
  return rows;
}

let searchRowsCache = { query: null, rows: null };

export function getSearchRows(query) {
  if (searchRowsCache.query === query) return searchRowsCache.rows;
  const rows = [searchHeaderRow, ...keyboardRows, ...buildResultRows(query)];
  searchRowsCache = { query, rows };
  return rows;
}

/* ---------- Player overlay ---------- */

export function getPlayerControls(playback) {
  if (!playback || playback.media.kind === 'app') {
    return [{ id: 'close', label: 'Close', icon: 'close' }];
  }
  return [
    { id: 'restart', label: 'Start Over', icon: 'restart' },
    {
      id: 'playPause',
      label: playback.playing ? 'Pause' : 'Play',
      icon: playback.playing ? 'pause' : 'play',
    },
    { id: 'close', label: 'Close', icon: 'close' },
  ];
}
