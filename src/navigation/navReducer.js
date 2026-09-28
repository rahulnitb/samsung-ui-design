import {
  PAGES,
  SEARCH_FIRST_KEY_ROW,
  SEARCH_RESULTS_ROW,
  tabsRowIndex,
  getPageRows,
  getSearchRows,
  getPlayerControls,
  pageIndex,
} from './layouts.js';
import { moveFocus, rememberColumn, clamp, wrap } from './grid.js';
import { topOverlay, findOverlay } from './selectors.js';
import { sidebarItems, PAGE_TO_SIDEBAR } from '../data/sidebarData.js';
import { heroSlides } from '../data/heroData.js';
import { settingsCategories, createDefaultSettings } from '../data/settingsData.js';
import { profileContacts, initialFriendIds } from '../data/profileData.js';
import { bixbyPhrases, BIXBY_RESULT_LIMIT } from '../data/bixbyData.js';
import { mergedSearchResults } from '../utils/search.js';
import { currentSlot } from '../utils/time.js';

/*
 * The single source of truth for focus. Exactly one element is focused:
 *  - the top overlay (search / settings / player) when any overlay is open, else
 *  - the sidebar (area "sidebar", sidebarIndex), else
 *  - the page (area "main", main.row / main.col over getPageRows(page)).
 */

const MAX_QUERY_LENGTH = 32;
export const PLAYER_DURATION_SECONDS = 90 * 60;

export const initialNavState = {
  page: 'forYou',
  area: 'main',
  sidebarIndex: 0,
  main: { row: tabsRowIndex('forYou'), col: 0 }, // start on the "For You" tab
  colMemory: {},
  heroIndex: 0,
  overlays: [], // stack of { type, row, col, ... }; the last entry owns focus
  searchQuery: '',
  playback: null,
  settingsValues: createDefaultSettings(),
  friendIds: [...initialFriendIds],
  blockedIds: [],
  friendsStatus: 'idle', // 'idle' | 'loading' | 'ready' | 'error' — see api/friendsApi.js
  pendingSync: [], // outbox of { seq, op, contactId } for the background friends-API sync
  pendingSyncSeq: 0,
  pendingShares: [], // outbox of { seq, friendId, friendName, itemIds } for the websocket share send
  pendingSharesSeq: 0,
  qr: {
    status: 'idle', // 'idle' | 'requesting' | 'displaying' | 'connected' | 'error'
    qrId: null,
    qrUrl: null,
    wsUrl: null,
    wsStatus: 'idle', // 'idle' | 'open' | 'closed'
    lastPingAt: null,
  },
  bixbyIndex: 0, // cycles through bixbyPhrases so repeat demos show something different
  toast: null,
  toastSeq: 0,
  debug: false,
  lastKey: '—',
};

export function navReducer(state, action) {
  const next = reduce(state, action);
  return action.key ? { ...next, lastKey: action.key } : next;
}

function reduce(state, action) {
  switch (action.type) {
    case 'REMOTE':
      return handleCommand(state, action.command);
    case 'FOCUS':
      // Mouse hover: move focus without activating.
      return focusTarget(state, action.target) ?? state;
    case 'CLICK': {
      // Mouse: move focus to the clicked element, then activate it.
      const focused = focusTarget(state, action.target);
      return focused ? handleCommand(focused, 'enter') : state;
    }
    case 'CLOSE_OVERLAY':
      return state.overlays.length ? closeOverlay(state) : state;
    case 'TYPE_CHAR':
      return isSearchOnTop(state) ? setQuery(state, state.searchQuery + action.char) : state;
    case 'DELETE_CHAR':
      return isSearchOnTop(state) ? setQuery(state, state.searchQuery.slice(0, -1)) : state;
    case 'HERO_NEXT':
      return { ...state, heroIndex: wrap(state.heroIndex + 1, heroSlides.length) };
    case 'HERO_SET':
      return { ...state, heroIndex: wrap(action.index, heroSlides.length) };
    case 'PLAYER_TICK':
      return tickPlayer(state);
    case 'ADD_FRIEND':
      return addFriend(state, action.contactId);
    case 'REMOVE_FRIEND':
      return removeFriend(state, action.contactId);
    case 'BLOCK_FRIEND':
      return blockContact(state, action.contactId);
    case 'UNBLOCK_FRIEND':
      return unblockContact(state, action.contactId);
    case 'FRIENDS_LOAD_START':
      return { ...state, friendsStatus: 'loading' };
    case 'FRIENDS_LOAD_SUCCESS':
      return { ...state, friendsStatus: 'ready', friendIds: action.friendIds, blockedIds: action.blockedIds };
    case 'FRIENDS_LOAD_ERROR':
      return { ...state, friendsStatus: 'error' };
    case 'FRIENDS_SYNC_DEQUEUE':
      return { ...state, pendingSync: state.pendingSync.filter((entry) => entry.seq !== action.seq) };
    case 'QR_REQUEST_START':
      return { ...state, qr: { ...state.qr, status: 'requesting' } };
    case 'QR_REQUEST_SUCCESS':
      return { ...state, qr: { ...state.qr, status: 'displaying', qrId: action.qrId, qrUrl: action.qrUrl } };
    case 'QR_REQUEST_ERROR':
      return { ...state, qr: { ...state.qr, status: 'error' } };
    case 'QR_STATUS_UPDATE': {
      if (action.status !== 'connected') return state;
      const next = { ...state, qr: { ...state.qr, status: 'connected', wsUrl: action.wsUrl } };
      const closed = topOverlay(next)?.type === 'qr' ? closeOverlay(next) : next;
      return showToast(closed, 'Device connected');
    }
    case 'QR_SOCKET_OPEN':
      return { ...state, qr: { ...state.qr, wsStatus: 'open' } };
    case 'QR_SOCKET_CLOSED':
      return { ...state, qr: { ...state.qr, wsStatus: 'closed' } };
    case 'QR_SOCKET_PING':
      return { ...state, qr: { ...state.qr, lastPingAt: action.at } };
    case 'WS_CONTENT_RECEIVED':
      if (findOverlay(state, 'wsResult')) return state; // don't interrupt an in-progress selection
      return {
        ...state,
        overlays: [...state.overlays, { type: 'wsResult', row: 1, col: 0, id: action.id, items: action.items, selectedIds: [] }],
      };
    case 'SHARE_SENT': {
      const entry = state.pendingShares.find((e) => e.seq === action.seq);
      const next = { ...state, pendingShares: state.pendingShares.filter((e) => e.seq !== action.seq) };
      return entry ? showToast(next, `Content shared with ${entry.friendName}`) : next;
    }
    case 'SHOW_TOAST':
      return showToast(state, action.message);
    case 'BIXBY_HEARD':
      return handleBixbyResult(state);
    case 'CLEAR_TOAST':
      return state.toast?.id === action.id ? { ...state, toast: null } : state;
    case 'TOGGLE_DEBUG':
      return { ...state, debug: !state.debug };
    case 'KEY_LOGGED':
      return state; // lastKey is recorded by navReducer
    default:
      return state;
  }
}

function handleCommand(state, command) {
  const overlay = topOverlay(state);
  if (overlay) return OVERLAY_HANDLERS[overlay.type](state, overlay, command);
  return state.area === 'sidebar' ? sidebarCommand(state, command) : mainCommand(state, command);
}

/* ---------------- Shared helpers ---------------- */

function showToast(state, message) {
  const id = state.toastSeq + 1;
  return { ...state, toast: { id, message }, toastSeq: id };
}

function focusTarget(state, target) {
  const overlay = topOverlay(state);

  if (target.area === 'overlay') {
    if (!overlay || overlay.type !== target.overlay) return null;
    const patch = { row: target.row, col: target.col };
    if ((overlay.type === 'settings' || overlay.type === 'profile') && target.col === 0) patch.category = target.row;
    if (overlay.type === 'search') {
      patch.memory = rememberColumn(overlay.memory, getSearchRows(state.searchQuery), patch);
    }
    return updateTopOverlay(state, patch);
  }

  if (overlay) return null; // page elements are inert while an overlay is open
  if (target.area === 'sidebar') return { ...state, area: 'sidebar', sidebarIndex: target.index };
  return setMainFocus(state, { row: target.row, col: target.col });
}

/* ---------------- Page (main area) ---------------- */

function setMainFocus(state, position) {
  const rows = getPageRows(state.page);
  const next = {
    ...state,
    area: 'main',
    main: position,
    colMemory: rememberColumn(state.colMemory, rows, position),
  };
  // Moving along the tab bar switches the page immediately, like a TV home screen.
  // The tab row can sit at a different index on each page, so re-anchor focus on it.
  if (rows[position.row].kind === 'tabs') {
    const page = PAGES[position.col].id;
    if (page !== state.page) {
      next.page = page;
      next.main = { row: tabsRowIndex(page), col: position.col };
    }
  }
  return next;
}

// Opens a page with focus on `row` (default: the first row below the tab pill).
function switchPage(state, page, row = tabsRowIndex(page) + 1) {
  const rows = getPageRows(page);
  const target = rows[row];
  const col =
    target.kind === 'tabs' ? pageIndex(page) : clamp(state.colMemory[target.id] ?? 0, 0, target.items.length - 1);
  return { ...state, page, area: 'main', main: { row, col } };
}

function focusSidebar(state) {
  const index = sidebarItems.findIndex((item) => item.id === PAGE_TO_SIDEBAR[state.page]);
  return { ...state, area: 'sidebar', sidebarIndex: Math.max(0, index) };
}

function mainCommand(state, command) {
  const rows = getPageRows(state.page);
  const row = rows[state.main.row];

  // In the hero, Left/Right browse slides instead of moving focus.
  if (row.kind === 'hero' && (command === 'left' || command === 'right')) {
    const step = command === 'left' ? -1 : 1;
    return { ...state, heroIndex: wrap(state.heroIndex + step, heroSlides.length) };
  }

  switch (command) {
    case 'up':
    case 'down':
    case 'left':
    case 'right': {
      const position = moveFocus(rows, state.main, command, state.colMemory);
      if (!position) return command === 'left' ? focusSidebar(state) : state;
      // Entering the tab bar from below always lands on the current page's tab.
      if (position.row !== state.main.row && rows[position.row].kind === 'tabs') {
        position.col = pageIndex(state.page);
      }
      return setMainFocus(state, position);
    }
    case 'enter':
      return activateMainItem(state, row, state.main.col);
    case 'back': {
      // Back: jump to the tab pill, then to For You, then to the sidebar.
      const tabsRow = tabsRowIndex(state.page);
      if (state.main.row !== tabsRow) return switchPage(state, state.page, tabsRow);
      if (state.page !== 'forYou') return switchPage(state, 'forYou', tabsRowIndex('forYou'));
      return focusSidebar(state);
    }
    default:
      return state;
  }
}

function activateMainItem(state, row, col) {
  const item = row.items[col];
  switch (row.kind) {
    case 'tabs':
      return switchPage(state, item.id);
    case 'hero':
      return openPlayer(state, videoMedia(heroSlides[state.heroIndex]));
    case 'cards':
      return openPlayer(state, videoMedia(item));
    case 'channels':
      return openPlayer(state, liveMedia(item));
    case 'apps':
    case 'appGrid':
    case 'editorsChoice':
      // Bixby isn't a streaming app — it opens the voice-search overlay instead.
      return item.id === 'bixby' ? openOverlay(state, 'bixby') : openPlayer(state, appMedia(item));
    case 'categories':
      return showToast(state, `${item.name}: ${item.count} apps (coming soon)`);
    default:
      return state;
  }
}

/* ---------------- Sidebar ---------------- */

function sidebarCommand(state, command) {
  const last = sidebarItems.length - 1;
  switch (command) {
    case 'up':
      return { ...state, sidebarIndex: Math.max(0, state.sidebarIndex - 1) };
    case 'down':
      return { ...state, sidebarIndex: Math.min(last, state.sidebarIndex + 1) };
    case 'right':
    case 'back':
      return { ...state, area: 'main' };
    case 'enter':
      return activateSidebarItem(state, sidebarItems[state.sidebarIndex]);
    default:
      return state;
  }
}

function activateSidebarItem(state, item) {
  const { action } = item;
  switch (action.type) {
    case 'page':
      return switchPage(state, action.page);
    case 'overlay':
      return openOverlay(state, action.overlay);
    case 'toast':
      return showToast(state, action.message);
    default:
      return state;
  }
}

/* ---------------- Overlays ---------------- */

const OVERLAY_INITIAL_FOCUS = {
  search: () => ({ row: SEARCH_FIRST_KEY_ROW, col: 0, memory: {} }),
  settings: () => ({ row: 0, col: 0, category: 0 }),
  profile: () => ({ row: 0, col: 0, category: 0 }),
  bixby: () => ({ row: 0, col: 0 }), // just the Cancel button
  qr: () => ({ row: 0, col: 0 }), // just the Close button
  friendConfirm: () => ({ row: 0, col: 0 }), // Remove / Block / Cancel
};

function openOverlay(state, type) {
  if (topOverlay(state)?.type === type) return state;
  return { ...state, overlays: [...state.overlays, { type, ...OVERLAY_INITIAL_FOCUS[type]() }] };
}

function closeOverlay(state) {
  const closing = topOverlay(state);
  return {
    ...state,
    overlays: state.overlays.slice(0, -1),
    playback: closing.type === 'player' ? null : state.playback,
    // Reopening the sidebar's QR icon should start a fresh request — but only if we're closing
    // before a connection ever succeeded; a connected close (see QR_STATUS_UPDATE) must keep
    // wsUrl/qrId alive since the socket hook (useQrSocket.js) depends on them persisting.
    qr: closing.type === 'qr' && state.qr.status !== 'connected' ? { ...initialNavState.qr } : state.qr,
  };
}

function updateTopOverlay(state, patch) {
  const overlays = [...state.overlays];
  overlays[overlays.length - 1] = { ...overlays[overlays.length - 1], ...patch };
  return { ...state, overlays };
}

/* ---- Search ---- */

const isSearchOnTop = (state) => topOverlay(state)?.type === 'search';

function setQuery(state, query) {
  const next = { ...state, searchQuery: query.slice(0, MAX_QUERY_LENGTH) };
  const overlay = topOverlay(next);
  // The header and keyboard are fixed rows; typing while focused there never moves focus.
  if (overlay.row < SEARCH_RESULTS_ROW) return next;

  // Below the keyboard, results are grouped by type and whole rows appear/disappear as the
  // query changes (e.g. the "Apps" row vanishes once no app matches). Rather than guess
  // whether the row the user was on still means the same thing, jump to the top result —
  // predictable, and how most TV search screens behave as you keep typing.
  const rows = getSearchRows(next.searchQuery);
  if (rows.length <= SEARCH_RESULTS_ROW) return updateTopOverlay(next, { row: SEARCH_RESULTS_ROW - 1, col: 0 });
  return updateTopOverlay(next, { row: SEARCH_RESULTS_ROW, col: 0 });
}

function searchCommand(state, overlay, command) {
  const rows = getSearchRows(state.searchQuery);
  if (command === 'back') return closeOverlay(state);
  if (command === 'enter') return activateSearchItem(state, rows, overlay);

  const position = moveFocus(rows, overlay, command, overlay.memory);
  if (!position) return state;
  return updateTopOverlay(state, { ...position, memory: rememberColumn(overlay.memory, rows, position) });
}

function activateSearchItem(state, rows, overlay) {
  const row = rows[overlay.row];
  const item = row.items[overlay.col];
  switch (row.kind) {
    case 'header':
      return item.type === 'back' ? closeOverlay(state) : setQuery(state, '');
    case 'keys':
      if (item.type === 'char') return setQuery(state, state.searchQuery + item.value);
      if (item.type === 'space') return setQuery(state, state.searchQuery + ' ');
      if (item.type === 'delete') return setQuery(state, state.searchQuery.slice(0, -1));
      if (item.type === 'submit') {
        if (rows.length <= SEARCH_RESULTS_ROW) return showToast(state, 'No results match your search');
        return updateTopOverlay(state, { row: SEARCH_RESULTS_ROW, col: 0 });
      }
      return state;
    case 'results':
      if (row.resultType === 'channels') return openPlayer(state, liveMedia(item));
      if (row.resultType === 'apps') return openPlayer(state, appMedia(item));
      return openPlayer(state, videoMedia(item));
    default:
      return state;
  }
}

/* ---- Settings ---- */

function settingsCommand(state, overlay, command) {
  const category = settingsCategories[overlay.category];

  if (overlay.col === 0) {
    switch (command) {
      case 'up':
      case 'down': {
        const row = clamp(overlay.row + (command === 'up' ? -1 : 1), 0, settingsCategories.length - 1);
        return updateTopOverlay(state, { row, category: row });
      }
      case 'right':
      case 'enter':
        return updateTopOverlay(state, { col: 1, row: 0 });
      case 'back':
        return closeOverlay(state);
      default:
        return state;
    }
  }

  switch (command) {
    case 'up':
    case 'down': {
      const row = clamp(overlay.row + (command === 'up' ? -1 : 1), 0, category.options.length - 1);
      return updateTopOverlay(state, { row });
    }
    case 'left':
    case 'back':
      return updateTopOverlay(state, { col: 0, row: overlay.category });
    case 'enter':
      return cycleSetting(state, category.options[overlay.row]);
    default:
      return state;
  }
}

function cycleSetting(state, option) {
  if (option.values.length < 2) return showToast(state, `${option.label}: ${option.values[0]}`);
  const current = state.settingsValues[option.id] ?? 0;
  return {
    ...state,
    settingsValues: { ...state.settingsValues, [option.id]: (current + 1) % option.values.length },
  };
}

/* ---- Profile (friends) ---- */

const PROFILE_SECTION_COUNT = 3; // 0: Friends List, 1: Add Friends, 2: Blocked

const friendsList = (state) => profileContacts.filter((contact) => state.friendIds.includes(contact.id));
const addableContacts = (state) =>
  profileContacts.filter((contact) => !state.friendIds.includes(contact.id) && !state.blockedIds.includes(contact.id));
const blockedList = (state) => profileContacts.filter((contact) => state.blockedIds.includes(contact.id));
const listForCategory = (state, category) => {
  if (category === 0) return friendsList(state);
  if (category === 1) return addableContacts(state);
  return blockedList(state);
};

function profileCommand(state, overlay, command) {
  if (overlay.col === 0) {
    switch (command) {
      case 'up':
      case 'down': {
        const row = clamp(overlay.row + (command === 'up' ? -1 : 1), 0, PROFILE_SECTION_COUNT - 1);
        return updateTopOverlay(state, { row, category: row });
      }
      case 'right':
      case 'enter': {
        if (listForCategory(state, overlay.category).length === 0) return state; // nothing to select
        return updateTopOverlay(state, { col: 1, row: 0 });
      }
      case 'back':
        return closeOverlay(state);
      default:
        return state;
    }
  }

  const list = listForCategory(state, overlay.category);
  switch (command) {
    case 'up':
    case 'down': {
      const row = clamp(overlay.row + (command === 'up' ? -1 : 1), 0, Math.max(0, list.length - 1));
      return updateTopOverlay(state, { row });
    }
    case 'left':
    case 'back':
      return updateTopOverlay(state, { col: 0, row: overlay.category });
    case 'enter': {
      const contact = list[overlay.row];
      if (!contact) return state;
      if (overlay.category === 0) {
        // Opens a Remove/Block/Cancel popup on top instead of acting immediately —
        // see friendConfirmCommand.
        return {
          ...state,
          overlays: [...state.overlays, { type: 'friendConfirm', row: 0, col: 0, contactId: contact.id, contactName: contact.name }],
        };
      }
      return overlay.category === 1 ? addFriend(state, contact.id) : unblockContact(state, contact.id);
    }
    default:
      return state;
  }
}

// Records that a friends-API call needs to happen in the background (see
// ProfileOverlay.jsx's pendingSync effect) — the local state below is already the
// optimistic result, kept snappy for remote-control use; the API call just syncs it.
function queueFriendsSync(state, op, contactId) {
  const seq = state.pendingSyncSeq + 1;
  return { ...state, pendingSync: [...state.pendingSync, { seq, op, contactId }], pendingSyncSeq: seq };
}

function addFriend(state, contactId) {
  const contact = profileContacts.find((entry) => entry.id === contactId);
  if (!contact || state.friendIds.includes(contactId)) return state;
  const next = { ...state, friendIds: [...state.friendIds, contactId] };
  return clampProfileOverlay(queueFriendsSync(showToast(next, `${contact.name} added to your friends`), 'add', contactId));
}

function removeFriend(state, contactId) {
  const contact = profileContacts.find((entry) => entry.id === contactId);
  if (!contact) return state;
  const next = { ...state, friendIds: state.friendIds.filter((id) => id !== contactId) };
  return clampProfileOverlay(queueFriendsSync(showToast(next, `${contact.name} removed from your friends`), 'delete', contactId));
}

function blockContact(state, contactId) {
  const contact = profileContacts.find((entry) => entry.id === contactId);
  if (!contact || state.blockedIds.includes(contactId)) return state;
  const next = {
    ...state,
    friendIds: state.friendIds.filter((id) => id !== contactId),
    blockedIds: [...state.blockedIds, contactId],
  };
  return clampProfileOverlay(queueFriendsSync(showToast(next, `${contact.name} blocked`), 'block', contactId));
}

function unblockContact(state, contactId) {
  const contact = profileContacts.find((entry) => entry.id === contactId);
  if (!contact) return state;
  const next = { ...state, blockedIds: state.blockedIds.filter((id) => id !== contactId) };
  return clampProfileOverlay(queueFriendsSync(showToast(next, `${contact.name} unblocked`), 'unblock', contactId));
}

// After a friend list changes the current tab's list changes length; keep focus valid,
// falling back to the section tabs if the current list just became empty.
function clampProfileOverlay(state) {
  const overlay = topOverlay(state);
  if (overlay?.type !== 'profile' || overlay.col !== 1) return state;
  const list = listForCategory(state, overlay.category);
  if (list.length === 0) return updateTopOverlay(state, { col: 0, row: overlay.category });
  if (overlay.row >= list.length) return updateTopOverlay(state, { row: list.length - 1 });
  return state;
}

/* ---- Friend confirm (Remove / Block / Cancel) ---- */

function friendConfirmCommand(state, overlay, command) {
  switch (command) {
    case 'up':
    case 'down': {
      const row = clamp(overlay.row + (command === 'up' ? -1 : 1), 0, 2);
      return updateTopOverlay(state, { row });
    }
    case 'back':
      return closeOverlay(state);
    case 'enter': {
      const popped = closeOverlay(state);
      if (overlay.row === 0) return removeFriend(popped, overlay.contactId);
      if (overlay.row === 1) return blockContact(popped, overlay.contactId);
      return popped; // Cancel
    }
    default:
      return state;
  }
}

/* ---- Websocket incoming-share result (checkbox-select + share to a friend) ---- */

// Mirrors bixbyResultCommand's shape (row 0: controls, row 1: tiles), except row 0 has two
// controls (Share/Close) instead of one, and Enter on a tile toggles its checkbox rather than
// opening a player.
function wsResultCommand(state, overlay, command) {
  const itemCount = overlay.items.length;
  switch (command) {
    case 'up':
      return overlay.row === 1 ? updateTopOverlay(state, { row: 0, col: 0 }) : state;
    case 'down':
      return overlay.row === 0 && itemCount > 0 ? updateTopOverlay(state, { row: 1, col: 0 }) : state;
    case 'left':
      return overlay.col > 0 ? updateTopOverlay(state, { col: overlay.col - 1 }) : state;
    case 'right': {
      const max = overlay.row === 0 ? 1 : itemCount - 1; // row 0: Share(0)/Close(1); row 1: tiles
      return overlay.col < max ? updateTopOverlay(state, { col: overlay.col + 1 }) : state;
    }
    case 'back':
      return closeOverlay(state);
    case 'enter': {
      if (overlay.row === 0) {
        if (overlay.col === 1) return closeOverlay(state); // Close
        if (overlay.selectedIds.length === 0) return showToast(state, 'Select at least one item to share');
        return { ...state, overlays: [...state.overlays, { type: 'shareTarget', row: 0, col: 0 }] };
      }
      const item = overlay.items[overlay.col];
      if (!item) return state;
      const selectedIds = overlay.selectedIds.includes(item.id)
        ? overlay.selectedIds.filter((id) => id !== item.id)
        : [...overlay.selectedIds, item.id];
      return updateTopOverlay(state, { selectedIds });
    }
    default:
      return state;
  }
}

/* ---- Share target (pick one friend to share the selected items with) ---- */

function shareTargetCommand(state, overlay, command) {
  const friends = friendsList(state);
  switch (command) {
    case 'up':
    case 'down': {
      const row = clamp(overlay.row + (command === 'up' ? -1 : 1), 0, Math.max(0, friends.length - 1));
      return updateTopOverlay(state, { row });
    }
    case 'back':
      return closeOverlay(state); // back to wsResult, selection kept
    case 'enter': {
      const friend = friends[overlay.row];
      if (!friend) return state;
      const wsOverlay = state.overlays[state.overlays.length - 2]; // the wsResult beneath
      const popped = closeOverlay(closeOverlay(state)); // pop shareTarget, then wsResult
      const seq = popped.pendingSharesSeq + 1;
      return {
        ...popped,
        pendingShares: [
          ...popped.pendingShares,
          { seq, friendId: friend.id, friendName: friend.name, itemIds: wsOverlay.selectedIds },
        ],
        pendingSharesSeq: seq,
      };
    }
    default:
      return state;
  }
}

/* ---- QR code ---- */

function qrCommand(state, overlay, command) {
  // The only thing on screen is the Close button — Enter and Back both dismiss it.
  if (command === 'enter' || command === 'back') return closeOverlay(state);
  return state;
}

/* ---- Bixby (voice search) ---- */

function bixbyCommand(state, overlay, command) {
  // The only thing on screen is the Cancel button — Enter and Back both dismiss it.
  if (command === 'enter' || command === 'back') return closeOverlay(state);
  return state;
}

// Fires once the "listening" timer elapses. Resolves into a floating result popup —
// a single row of matches hovering over whatever screen was already showing, rather
// than taking over into the full Search page. Collapses any overlay stack under it
// (Bixby can also be invoked while Search is already open) down to just that popup.
function handleBixbyResult(state) {
  if (topOverlay(state)?.type !== 'bixby') return state; // cancelled before Bixby "heard" anything
  const phrase = bixbyPhrases[state.bixbyIndex % bixbyPhrases.length];
  const items = mergedSearchResults(phrase.query, BIXBY_RESULT_LIMIT);
  return {
    ...state,
    overlays: [{ type: 'bixbyResult', row: 1, col: 0, phrase, items }],
    bixbyIndex: state.bixbyIndex + 1,
  };
}

function bixbyResultCommand(state, overlay, command) {
  const itemCount = overlay.items.length;
  switch (command) {
    case 'up':
      return overlay.row === 1 ? updateTopOverlay(state, { row: 0, col: 0 }) : state;
    case 'down':
      return overlay.row === 0 && itemCount > 0 ? updateTopOverlay(state, { row: 1, col: 0 }) : state;
    case 'left':
      return overlay.row === 1 && overlay.col > 0 ? updateTopOverlay(state, { col: overlay.col - 1 }) : state;
    case 'right':
      return overlay.row === 1 && overlay.col < itemCount - 1 ? updateTopOverlay(state, { col: overlay.col + 1 }) : state;
    case 'back':
      return closeOverlay(state);
    case 'enter': {
      if (overlay.row === 0) return closeOverlay(state); // the Close button
      const item = overlay.items[overlay.col];
      if (!item) return state;
      if (item.resultType === 'channels') return openPlayer(state, liveMedia(item));
      if (item.resultType === 'apps') return openPlayer(state, appMedia(item));
      return openPlayer(state, videoMedia(item));
    }
    default:
      return state;
  }
}

/* ---- Player ---- */

const videoMedia = (item) => ({
  kind: 'video',
  id: item.id,
  title: item.title,
  subtitle: item.subtitle ?? [item.year, item.genre, item.rating].filter(Boolean).join(' · '),
  palette: item.palette,
  image: item.image,
  progress: item.progress ?? 0,
});

const liveMedia = (channel) => ({
  kind: 'live',
  id: channel.id,
  title: channel.program,
  subtitle: `CH ${channel.number} · ${channel.name}`,
  palette: channel.palette,
  image: null,
  progress: currentSlot(channel, Date.now()).progress,
});

const appMedia = (app) => ({ kind: 'app', id: app.id, title: app.name, app });

function openPlayer(state, media) {
  const playback = { media, playing: media.kind !== 'app', position: media.progress ?? 0 };
  const controls = getPlayerControls(playback);
  const col = Math.max(0, controls.findIndex((control) => control.id === 'playPause'));
  return { ...state, playback, overlays: [...state.overlays, { type: 'player', row: 0, col }] };
}

function tickPlayer(state) {
  const { playback } = state;
  if (!playback?.playing) return state;
  const position = playback.position + 1 / PLAYER_DURATION_SECONDS;
  return { ...state, playback: { ...playback, position: position >= 1 ? 0 : position } };
}

function playerCommand(state, overlay, command) {
  const controls = getPlayerControls(state.playback);
  switch (command) {
    case 'left':
    case 'right': {
      const col = clamp(overlay.col + (command === 'left' ? -1 : 1), 0, controls.length - 1);
      return updateTopOverlay(state, { col });
    }
    case 'back':
      return closeOverlay(state);
    case 'enter': {
      const control = controls[overlay.col];
      if (control.id === 'close') return closeOverlay(state);
      if (control.id === 'restart') return { ...state, playback: { ...state.playback, position: 0, playing: true } };
      if (control.id === 'playPause') {
        return { ...state, playback: { ...state.playback, playing: !state.playback.playing } };
      }
      return state;
    }
    default:
      return state;
  }
}

const OVERLAY_HANDLERS = {
  search: searchCommand,
  settings: settingsCommand,
  profile: profileCommand,
  friendConfirm: friendConfirmCommand,
  wsResult: wsResultCommand,
  shareTarget: shareTargetCommand,
  qr: qrCommand,
  bixby: bixbyCommand,
  bixbyResult: bixbyResultCommand,
  player: playerCommand,
};
