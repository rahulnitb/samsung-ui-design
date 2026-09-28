import { useNavDispatch, useNavState } from '../navigation/NavigationContext.jsx';
import { findOverlay, isOverlayFocused, makeTarget } from '../navigation/selectors.js';
import { usePresence, useLastDefined } from '../hooks/usePresence.js';
import { profileContacts } from '../data/profileData.js';
import FocusIndicator from './FocusIndicator.jsx';
import Icon from './Icon.jsx';
import './ShareTargetPopup.css';

const SCOPE = 'shareTarget';

/**
 * Opened from WsResultPopup's Share button (pushed on top of it, which stays visible and
 * dimmed underneath — same stacking as FriendConfirmPopup over ProfileOverlay). Enter on a
 * friend shares the selected items with just that one friend and closes both popups.
 */
export default function ShareTargetPopup() {
  const state = useNavState();
  const dispatch = useNavDispatch();
  const liveEntry = findOverlay(state, SCOPE);
  const entry = useLastDefined(liveEntry);
  const { mounted, closing } = usePresence(Boolean(liveEntry));
  if (!mounted || !entry) return null;

  const friends = profileContacts.filter((contact) => state.friendIds.includes(contact.id));
  const itemCount = findOverlay(state, 'wsResult')?.selectedIds.length ?? 0;

  return (
    <div
      className={`share-target-scrim ${closing ? 'is-closing' : ''}`}
      onClick={() => dispatch({ type: 'CLOSE_OVERLAY' })}
    >
      <div
        className={`share-target ${closing ? 'is-closing' : ''}`}
        role="dialog"
        aria-label="Share with a friend"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="share-target__badge">
          <Icon name="share" />
        </span>
        <p className="share-target__title">Share with…</p>
        {itemCount > 0 && (
          <p className="share-target__subtitle">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
          </p>
        )}
        {friends.length === 0 ? (
          <p className="share-target__empty">Add friends first to share content.</p>
        ) : (
          <ul className="share-target__list">
            {friends.map((friend, row) => (
              <li key={friend.id}>
                <FocusIndicator
                  variant="fill"
                  focused={isOverlayFocused(state, SCOPE, row, 0)}
                  target={makeTarget(SCOPE, row, 0)}
                  className="share-target__friend"
                >
                  <span
                    className="share-target__avatar"
                    style={{ background: friend.avatarBg, color: friend.avatarFg }}
                  >
                    {friend.name[0]}
                  </span>
                  <span className="share-target__info">
                    <span className="share-target__name">{friend.name}</span>
                    <span className="share-target__handle">{friend.handle}</span>
                  </span>
                  <Icon name="chevronRight" className="share-target__chevron" />
                </FocusIndicator>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
