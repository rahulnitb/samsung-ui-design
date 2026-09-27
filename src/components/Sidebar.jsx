import { useNavState } from '../navigation/NavigationContext.jsx';
import { hasOverlay, isSidebarFocused } from '../navigation/selectors.js';
import { sidebarItems, PAGE_TO_SIDEBAR } from '../data/sidebarData.js';
import { profileUser } from '../data/profileData.js';
import FocusIndicator from './FocusIndicator.jsx';
import Icon from './Icon.jsx';
import './Sidebar.css';

export default function Sidebar() {
  const state = useNavState();
  const expanded = state.area === 'sidebar' && !hasOverlay(state);
  const activeId = PAGE_TO_SIDEBAR[state.page];

  const renderItem = (item, index) => (
    <li key={item.id}>
      <FocusIndicator
        variant="fill"
        focused={isSidebarFocused(state, index)}
        target={{ area: 'sidebar', index }}
        className={`sidebar__item ${item.id === activeId ? 'is-active' : ''}`}
      >
        {item.id === 'profile' ? (
          <span className="sidebar__avatar" style={{ background: profileUser.avatarBg }}>
            {profileUser.name[0]}
          </span>
        ) : (
          <Icon name={item.icon} className="sidebar__icon" />
        )}
        <span className="sidebar__label">{item.label}</span>
      </FocusIndicator>
    </li>
  );

  return (
    <nav className={`sidebar ${expanded ? 'sidebar--expanded' : ''}`} aria-label="Main navigation">
      <ul className="sidebar__list">
        {sidebarItems.map((item, index) => (item.pinBottom ? null : renderItem(item, index)))}
      </ul>
      <ul className="sidebar__list sidebar__list--bottom">
        {sidebarItems.map((item, index) => (item.pinBottom ? renderItem(item, index) : null))}
      </ul>
    </nav>
  );
}
