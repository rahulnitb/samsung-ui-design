import './Artwork.css';

const FALLBACK_PALETTE = ['#101218', '#3d4a66', '#1c2230'];

function hash(text) {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(value);
}

/**
 * Placeholder key art generated from a palette, or a real image when `item.image` is set.
 * The light "spot" position is derived from the id so each title looks different.
 */
export default function Artwork({ item, showTitle = true, className = '' }) {
  if (item.image) {
    return (
      <div className={`artwork artwork--image ${className}`}>
        <img src={item.image} alt="" loading="lazy" />
      </div>
    );
  }

  const [base, highlight, shadow] = item.palette ?? FALLBACK_PALETTE;
  const seed = hash(item.id ?? item.title ?? 'artwork');
  const style = {
    '--art-1': base,
    '--art-2': highlight,
    '--art-3': shadow,
    '--art-x': `${30 + (seed % 55)}%`,
    '--art-y': `${12 + ((seed >> 4) % 40)}%`,
  };

  return (
    <div className={`artwork ${className}`} style={style}>
      {showTitle && item.title && <span className="artwork__title">{item.title}</span>}
    </div>
  );
}
