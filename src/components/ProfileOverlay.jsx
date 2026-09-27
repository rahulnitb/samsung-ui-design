import { useNavDispatch, useNavState } from '../navigation/NavigationContext.jsx';
import { findOverlay, isOverlayFocused, makeTarget } from '../navigation/selectors.js';
import { profileUser, profileContacts } from '../data/profileData.js';
import { useLastDefined, usePresence } from '../hooks/usePresence.js';
import FocusIndicator from './FocusIndicator.jsx';
import './ProfileOverlay.css';

const SCOPE = 'profile';
const SECTIONS = ['Friends List', 'Add Friends'];

/**
 * Right-side panel opened from the sidebar avatar. Focus grid: col 0 = the two
 * section tabs, col 1 = the contact list for whichever section is selected.
 */
export default function ProfileOverlay() {
  const state = useNavState();
  const dispatch = useNavDispatch();
  const liveEntry = findOverlay(state, SCOPE);
  const entry = useLastDefined(liveEntry);
  const { mounted, closing } = usePresence(Boolean(liveEntry));
  if (!mounted || !entry) return null;

  const friends = profileContacts.filter((contact) => state.friendIds.includes(contact.id));
  const addable = profileContacts.filter((contact) => !state.friendIds.includes(contact.id));
  const isFriendsTab = entry.category === 0;
  const list = isFriendsTab ? friends : addable;
  const emptyText = isFriendsTab
    ? 'No friends yet — add some from the Add Friends tab.'
    : "You've added everyone in your contacts.";

  return (
    <div className={`profile-panel ${closing ? 'is-closing' : ''}`} role="dialog" aria-label="Profile">
      <div className="profile-panel__backdrop" onClick={() => dispatch({ type: 'CLOSE_OVERLAY' })} />
      <aside className="profile-panel__sheet">
        <header className="profile-panel__header">
          <span className="profile-panel__avatar" style={{ background: profileUser.avatarBg }}>
            {profileUser.name[0]}
          </span>
          <div>
            <h1>{profileUser.name}</h1>
            <p>{profileUser.handle}</p>
          </div>
        </header>

        <div className="profile-panel__body">
          <ul className="profile-panel__sections">
            {SECTIONS.map((label, index) => (
              <li key={label}>
                <FocusIndicator
                  variant="fill"
                  focused={isOverlayFocused(state, SCOPE, index, 0)}
                  target={makeTarget(SCOPE, index, 0)}
                  className={`profile-panel__section ${index === entry.category ? 'is-selected' : ''}`}
                >
                  <span>{label}</span>
                  <span className="profile-panel__count">{index === 0 ? friends.length : addable.length}</span>
                </FocusIndicator>
              </li>
            ))}
          </ul>

          <div className="profile-panel__list">
            {list.length === 0 ? (
              <p className="profile-panel__empty">{emptyText}</p>
            ) : (
              <ul>
                {list.map((contact, index) => (
                  <li key={contact.id}>
                    <FocusIndicator
                      variant="fill"
                      focused={isOverlayFocused(state, SCOPE, index, 1)}
                      target={makeTarget(SCOPE, index, 1)}
                      className="profile-panel__contact"
                    >
                      <span
                        className="profile-panel__contact-avatar"
                        style={{ background: contact.avatarBg, color: contact.avatarFg }}
                      >
                        {contact.name[0]}
                      </span>
                      <span className="profile-panel__contact-info">
                        <span className="profile-panel__contact-name">{contact.name}</span>
                        <span className="profile-panel__contact-handle">{contact.handle}</span>
                      </span>
                      <span className={`profile-panel__action ${isFriendsTab ? 'is-remove' : 'is-add'}`}>
                        {isFriendsTab ? 'Remove' : 'Add'}
                      </span>
                    </FocusIndicator>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <footer className="profile-panel__hint">
          Enter: {isFriendsTab ? 'remove friend' : 'add friend'} · ← / Esc: back
        </footer>
      </aside>
    </div>
  );
}
