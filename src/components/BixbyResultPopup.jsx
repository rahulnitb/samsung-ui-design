import { useRef } from 'react';
import { useNavDispatch, useNavState } from '../navigation/NavigationContext.jsx';
import { findOverlay, isOverlayFocused, makeTarget } from '../navigation/selectors.js';
import { usePresence, useLastDefined } from '../hooks/usePresence.js';
import { useHorizontalFocusScroll } from '../hooks/useFocusScroll.js';
import { useNow } from '../hooks/useNow.js';
import FocusIndicator from './FocusIndicator.jsx';
import ContentCard from './ContentCard.jsx';
import ChannelCard from './ChannelCard.jsx';
import AppIcon from './AppIcon.jsx';
import Icon from './Icon.jsx';
import './BixbyResultPopup.css';

const SCOPE = 'bixbyResult';

function renderResult(item, focus, now) {
  if (item.resultType === 'channels') return <ChannelCard channel={item} now={now} {...focus} />;
  if (item.resultType === 'apps') return <AppIcon app={item} shape="round" showName {...focus} />;
  return <ContentCard item={item} variant="compact" {...focus} />;
}

/**
 * What Bixby resolves into: a single row of results floating over whatever screen
 * was already showing (dimmed behind it), instead of taking over into the full
 * Search page. Row 0 is just the Close button; row 1 is the one row of results.
 */
export default function BixbyResultPopup() {
  const state = useNavState();
  const dispatch = useNavDispatch();
  const liveEntry = findOverlay(state, SCOPE);
  const entry = useLastDefined(liveEntry);
  const { mounted, closing } = usePresence(Boolean(liveEntry));
  const now = useNow(30000);
  const trackRef = useRef(null);
  useHorizontalFocusScroll(trackRef, entry?.row === 1 ? entry.col : 0);
  if (!mounted || !entry) return null;

  const focusedCol = liveEntry?.row === 1 ? liveEntry.col : null;

  return (
    <div
      className={`bixby-popup-scrim ${closing ? 'is-closing' : ''}`}
      onClick={() => dispatch({ type: 'CLOSE_OVERLAY' })}
    >
      <div
        className={`bixby-popup ${closing ? 'is-closing' : ''}`}
        role="dialog"
        aria-label="Bixby results"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bixby-popup__header">
          <span className="bixby-popup__badge">
            <Icon name="mic" />
          </span>
          <span className="bixby-popup__said">
            Bixby heard <strong>“{entry.phrase.said}”</strong>
          </span>
          <FocusIndicator
            variant="fill"
            focused={isOverlayFocused(state, SCOPE, 0, 0)}
            target={makeTarget(SCOPE, 0, 0)}
            className="bixby-popup__close"
          >
            <Icon name="close" />
          </FocusIndicator>
        </div>

        {entry.items.length === 0 ? (
          <p className="bixby-popup__empty">Nothing found for “{entry.phrase.query}”.</p>
        ) : (
          <div className="bixby-popup__track" ref={trackRef}>
            {entry.items.map((item, col) => (
              <div className="bixby-popup__item" key={item.id}>
                {renderResult(item, { focused: focusedCol === col, target: makeTarget(SCOPE, 1, col) }, now)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
