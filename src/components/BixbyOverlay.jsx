import { useEffect } from 'react';
import { useNavDispatch, useNavState } from '../navigation/NavigationContext.jsx';
import { findOverlay, isOverlayFocused, makeTarget } from '../navigation/selectors.js';
import { usePresence } from '../hooks/usePresence.js';
import { BIXBY_LISTEN_MS } from '../data/bixbyData.js';
import FocusIndicator from './FocusIndicator.jsx';
import Icon from './Icon.jsx';
import './BixbyOverlay.css';

const SCOPE = 'bixby';

/** Full-screen "listening" state opened from the Bixby launcher icon. Auto-resolves
 * into a Search overlay pre-filled with a dummy recognised phrase. */
export default function BixbyOverlay() {
  const state = useNavState();
  const dispatch = useNavDispatch();
  const open = Boolean(findOverlay(state, SCOPE));
  const { mounted, closing } = usePresence(open);

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'BIXBY_HEARD' }), BIXBY_LISTEN_MS);
    return () => clearTimeout(timer);
  }, [open, dispatch]);

  if (!mounted) return null;

  return (
    <div className={`bixby-overlay overlay-anim ${closing ? 'is-closing' : ''}`} role="dialog" aria-label="Bixby voice search">
      <div className="bixby-overlay__orb" aria-hidden="true">
        <span className="bixby-overlay__ring bixby-overlay__ring--1" />
        <span className="bixby-overlay__ring bixby-overlay__ring--2" />
        <span className="bixby-overlay__ring bixby-overlay__ring--3" />
        <div className="bixby-overlay__core">
          <Icon name="mic" className="bixby-overlay__mic" />
        </div>
      </div>
      <p className="bixby-overlay__label">Listening…</p>
      <p className="bixby-overlay__hint">Try “Play Inception” or “Open Netflix”</p>
      <FocusIndicator
        variant="fill"
        focused={isOverlayFocused(state, SCOPE, 0, 0)}
        target={makeTarget(SCOPE, 0, 0)}
        className="bixby-overlay__cancel"
      >
        Cancel
      </FocusIndicator>
    </div>
  );
}
