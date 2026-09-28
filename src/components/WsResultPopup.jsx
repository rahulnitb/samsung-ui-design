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
import './WsResultPopup.css';

const SCOPE = 'wsResult';

function renderResult(item, focus, now) {
  if (item.resultType === 'channels') return <ChannelCard channel={item} now={now} {...focus} />;
  if (item.resultType === 'apps') return <AppIcon app={item} shape="round" showName {...focus} />;
  return <ContentCard item={item} variant="compact" {...focus} />;
}

/**
 * What arrives when the paired companion device pushes content over the websocket (see
 * hooks/useQrSocket.js) — a row of tiles floating over whatever screen was already showing
 * (dimmed behind it, same treatment as BixbyResultPopup), except each tile has a checkbox so
 * several can be selected, plus a Share action that opens ShareTargetPopup.
 */
export default function WsResultPopup() {
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
  const selectedIds = entry.selectedIds ?? [];

  return (
    <div
      className={`ws-popup-scrim ${closing ? 'is-closing' : ''}`}
      onClick={() => dispatch({ type: 'CLOSE_OVERLAY' })}
    >
      <div
        className={`ws-popup ${closing ? 'is-closing' : ''}`}
        role="dialog"
        aria-label="Shared content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="ws-popup__header">
          <span className="ws-popup__badge">
            <Icon name="wifi" />
          </span>
          <span className="ws-popup__said">Received from your paired device</span>
          <FocusIndicator
            variant="fill"
            focused={isOverlayFocused(state, SCOPE, 0, 0)}
            target={makeTarget(SCOPE, 0, 0)}
            className={`ws-popup__action is-share ${selectedIds.length === 0 ? 'is-disabled' : ''}`}
          >
            <Icon name="share" />
            <span>Share{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}</span>
          </FocusIndicator>
          <FocusIndicator
            variant="fill"
            focused={isOverlayFocused(state, SCOPE, 0, 1)}
            target={makeTarget(SCOPE, 0, 1)}
            className="ws-popup__close"
          >
            <Icon name="close" />
          </FocusIndicator>
        </div>

        <div className="ws-popup__track" ref={trackRef}>
          {entry.items.map((item, col) => (
            <div className="ws-popup__item" key={item.id}>
              <span className={`ws-popup__checkbox ${selectedIds.includes(item.id) ? 'is-checked' : ''}`}>
                {selectedIds.includes(item.id) && <Icon name="check" />}
              </span>
              {renderResult(item, { focused: focusedCol === col, target: makeTarget(SCOPE, 1, col) }, now)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
