import FocusIndicator from './FocusIndicator.jsx';
import Artwork from './Artwork.jsx';
import './EditorsChoiceCard.css';

/** A bigger promo banner fronting one app — tagline baked into the artwork, the
 * app's own icon + name underneath. Matches the "Editor's Choice" row on Samsung's
 * Apps tab. */
export default function EditorsChoiceCard({ item, focused, target }) {
  const longLabel = item.label.length > 3;

  return (
    <FocusIndicator variant="none" focused={focused} target={target} className="editors-card">
      <div className="editors-card__banner focus-ring">
        <Artwork item={{ id: item.id, palette: item.palette, image: item.image }} showTitle={false} />
        <span className="editors-card__tagline">{item.tagline}</span>
      </div>
      <div className="editors-card__footer">
        <span
          className="editors-card__icon"
          style={{ '--app-bg': item.background, '--app-fg': item.foreground }}
        >
          {item.iconSvg ? (
            <svg
              className="editors-card__brand-svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              // Fixed, self-authored data (fetched once into data/appData.js), not user input.
              dangerouslySetInnerHTML={{ __html: item.iconSvg }}
            />
          ) : (
            <span className={`editors-card__icon-label ${longLabel ? 'editors-card__icon-label--long' : ''}`}>
              {item.label}
            </span>
          )}
        </span>
        <span className="editors-card__name">{item.name}</span>
      </div>
    </FocusIndicator>
  );
}
