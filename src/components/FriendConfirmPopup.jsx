import { useNavDispatch, useNavState } from '../navigation/NavigationContext.jsx';
import { findOverlay, isOverlayFocused, makeTarget } from '../navigation/selectors.js';
import { usePresence, useLastDefined } from '../hooks/usePresence.js';
import FocusIndicator from './FocusIndicator.jsx';
import './FriendConfirmPopup.css';

const SCOPE = 'friendConfirm';
const CHOICES = [
  { id: 'remove', label: 'Remove Friend' },
  { id: 'block', label: 'Block Friend' },
  { id: 'cancel', label: 'Cancel' },
];

/**
 * Opened by Enter on a friend in the Friends List tab (pushed on top of ProfileOverlay,
 * which stays mounted and dimmed underneath — same stacking as the player overlay).
 * Up/Down choose Remove / Block / Cancel, Enter confirms, Esc/Back/click-outside cancel.
 */
export default function FriendConfirmPopup() {
  const state = useNavState();
  const dispatch = useNavDispatch();
  const liveEntry = findOverlay(state, SCOPE);
  const entry = useLastDefined(liveEntry);
  const { mounted, closing } = usePresence(Boolean(liveEntry));
  if (!mounted || !entry) return null;

  return (
    <div
      className={`friend-confirm-scrim ${closing ? 'is-closing' : ''}`}
      onClick={() => dispatch({ type: 'CLOSE_OVERLAY' })}
    >
      <div
        className={`friend-confirm ${closing ? 'is-closing' : ''}`}
        role="dialog"
        aria-label={`Manage ${entry.contactName}`}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="friend-confirm__title">{entry.contactName}</p>
        <p className="friend-confirm__caption">What would you like to do?</p>
        <ul className="friend-confirm__choices">
          {CHOICES.map((choice, row) => (
            <li key={choice.id}>
              <FocusIndicator
                variant="fill"
                focused={isOverlayFocused(state, SCOPE, row, 0)}
                target={makeTarget(SCOPE, row, 0)}
                className={`friend-confirm__choice is-${choice.id}`}
              >
                {choice.label}
              </FocusIndicator>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
