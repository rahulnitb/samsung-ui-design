// Generic, UI-agnostic focus movement over a list of rows.
// A row is { id, items: [...], widths?: number[] }.
// `widths` (column units per item) enables spatial up/down movement, e.g. between
// keyboard rows with wide keys or between app-grid rows. Rows without widths restore
// the column they were last left at (remembered per row id), like a real TV UI.

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const wrap = (value, length) => ((value % length) + length) % length;

function spatialIndex(fromWidths, fromIndex, toWidths) {
  const start = fromWidths.slice(0, fromIndex).reduce((sum, width) => sum + width, 0);
  const center = start + fromWidths[fromIndex] / 2;
  let edge = 0;
  for (let index = 0; index < toWidths.length; index += 1) {
    edge += toWidths[index];
    if (center < edge) return index;
  }
  return toWidths.length - 1;
}

function columnForRow(fromRow, fromCol, toRow, memory) {
  if (fromRow.widths && toRow.widths) return spatialIndex(fromRow.widths, fromCol, toRow.widths);
  return clamp(memory[toRow.id] ?? 0, 0, toRow.items.length - 1);
}

/**
 * Returns the next { row, col } for a directional command, or null when the move
 * would leave the grid (callers decide what happens at the edge).
 * Empty rows are skipped.
 */
export function moveFocus(rows, position, command, memory = {}) {
  const row = rows[position.row];

  if (command === 'left' || command === 'right') {
    const col = position.col + (command === 'left' ? -1 : 1);
    return col >= 0 && col < row.items.length ? { row: position.row, col } : null;
  }

  if (command === 'up' || command === 'down') {
    const step = command === 'up' ? -1 : 1;
    let target = position.row + step;
    while (rows[target] && rows[target].items.length === 0) target += step;
    if (!rows[target]) return null;
    return { row: target, col: columnForRow(row, position.col, rows[target], memory) };
  }

  return null;
}

export const rememberColumn = (memory, rows, position) => ({
  ...memory,
  [rows[position.row].id]: position.col,
});
