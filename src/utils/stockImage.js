// Real, freely-licensed stock photography (via Lorem Picsum) used as placeholder key
// art. These are NOT actual movie/show posters — real poster art is copyrighted, and
// this project only uses generated placeholders or publicly usable images (see
// README). Seeding by the item's own id keeps each title's photo stable across
// reloads instead of changing every render.
export function stockImage(seed, width = 640, height = 400) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}
