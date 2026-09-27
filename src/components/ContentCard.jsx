import FocusIndicator from './FocusIndicator.jsx';
import Artwork from './Artwork.jsx';
import ProgressBar from './ProgressBar.jsx';
import './ContentCard.css';

/**
 * Movie / show card.
 * variant: "feature" (home row, art only) | "landscape" | "poster" | "compact".
 * `label` is an optional group heading drawn above the card (e.g. "Now Playing").
 */
export default function ContentCard({ item, variant = 'landscape', label, focused, target }) {
  const meta = item.meta ?? [item.year, item.genre].filter(Boolean).join(' · ');

  return (
    <FocusIndicator
      variant="none"
      focused={focused}
      target={target}
      className={`content-card content-card--${variant}`}
    >
      {label && <span className="content-card__label">{label}</span>}
      <div
        className={`content-card__media focus-ring ${item.progress != null ? 'has-progress' : ''} ${item.provider ? 'has-provider' : ''}`}
      >
        <Artwork item={item} />
        {item.badge && (
          <span className={`content-card__badge content-card__badge--${item.badge.toLowerCase()}`}>{item.badge}</span>
        )}
        {item.provider && <span className="content-card__provider">{item.provider}</span>}
        {item.progress != null && <ProgressBar value={item.progress} className="content-card__progress" />}
      </div>
      {variant !== 'feature' && (
        <div className="content-card__info">
          <div className="content-card__title">{item.title}</div>
          {meta && <div className="content-card__meta">{meta}</div>}
        </div>
      )}
    </FocusIndicator>
  );
}
