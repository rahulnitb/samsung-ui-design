import { getPageRows, getSearchRows } from './layouts.js';
import { sidebarItems } from '../data/sidebarData.js';
import { settingsOptionsById } from '../data/settingsData.js';

export const topOverlay = (state) => state.overlays[state.overlays.length - 1] ?? null;
export const hasOverlay = (state) => state.overlays.length > 0;
export const findOverlay = (state, type) => state.overlays.find((overlay) => overlay.type === type) ?? null;

export const isSidebarFocused = (state, index) =>
  !hasOverlay(state) && state.area === 'sidebar' && state.sidebarIndex === index;

export const isMainFocused = (state, row, col) =>
  !hasOverlay(state) && state.area === 'main' && state.main.row === row && state.main.col === col;

export function isOverlayFocused(state, type, row, col) {
  const overlay = topOverlay(state);
  return overlay?.type === type && overlay.row === row && overlay.col === col;
}

// A focus "scope" is either "main" (the page) or an overlay type such as "search".
export function makeTarget(scope, row, col) {
  return scope === 'main' ? { area: 'main', row, col } : { area: 'overlay', overlay: scope, row, col };
}

/**
 * Focus info for one horizontal row:
 * - focusedCol: the focused column, or null if focus is elsewhere
 * - scrollCol: the column the row should keep scrolled into view
 */
export function getRowFocus(state, scope, rowIndex, rowId) {
  if (scope === 'main') {
    const focused = !hasOverlay(state) && state.area === 'main' && state.main.row === rowIndex;
    const onRow = state.main.row === rowIndex;
    return {
      focusedCol: focused ? state.main.col : null,
      scrollCol: onRow ? state.main.col : state.colMemory[rowId] ?? 0,
    };
  }
  const overlay = findOverlay(state, scope);
  if (!overlay) return { focusedCol: null, scrollCol: 0 };
  const onRow = overlay.row === rowIndex;
  return {
    focusedCol: onRow && topOverlay(state) === overlay ? overlay.col : null,
    scrollCol: onRow ? overlay.col : overlay.memory?.[rowId] ?? 0,
  };
}

export function getSettingValue(state, optionId) {
  const option = settingsOptionsById[optionId];
  return option?.values[state.settingsValues[optionId] ?? 0];
}

// Human-readable focus description for the debug overlay.
export function describeFocus(state) {
  const overlay = topOverlay(state);
  if (overlay) {
    let rowId = 'controls';
    if (overlay.type === 'search') rowId = getSearchRows(state.searchQuery)[overlay.row]?.id;
    if (overlay.type === 'settings') rowId = overlay.col === 0 ? 'categories' : 'options';
    if (overlay.type === 'profile') rowId = overlay.col === 0 ? 'sections' : 'contacts';
    if (overlay.type === 'bixby') rowId = 'listening';
    if (overlay.type === 'bixbyResult') rowId = overlay.row === 0 ? 'close' : 'results';
    if (overlay.type === 'qr') rowId = 'close';
    return { area: `overlay:${overlay.type}`, rowId, row: overlay.row, col: overlay.col };
  }
  if (state.area === 'sidebar') {
    return { area: 'sidebar', rowId: sidebarItems[state.sidebarIndex].id, row: state.sidebarIndex, col: 0 };
  }
  const rows = getPageRows(state.page);
  return { area: 'main', rowId: rows[state.main.row].id, row: state.main.row, col: state.main.col };
}
