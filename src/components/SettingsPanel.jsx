import { useNavDispatch, useNavState } from '../navigation/NavigationContext.jsx';
import { findOverlay, isOverlayFocused, makeTarget } from '../navigation/selectors.js';
import { settingsCategories } from '../data/settingsData.js';
import { useLastDefined, usePresence } from '../hooks/usePresence.js';
import FocusIndicator from './FocusIndicator.jsx';
import Icon from './Icon.jsx';
import './SettingsPanel.css';

const SCOPE = 'settings';

/**
 * Right-side settings panel. Focus grid: col 0 = category list, col 1 = option list;
 * `row` is the index within that column.
 */
export default function SettingsPanel() {
  const state = useNavState();
  const dispatch = useNavDispatch();
  const liveEntry = findOverlay(state, SCOPE);
  const entry = useLastDefined(liveEntry);
  const { mounted, closing } = usePresence(Boolean(liveEntry));
  if (!mounted || !entry) return null;

  const category = settingsCategories[entry.category];

  return (
    <div className={`settings ${closing ? 'is-closing' : ''}`} role="dialog" aria-label="Settings">
      <div className="settings__backdrop" onClick={() => dispatch({ type: 'CLOSE_OVERLAY' })} />
      <aside className="settings__panel">
        <header className="settings__header">
          <Icon name="settings" />
          <h1>Settings</h1>
        </header>

        <div className="settings__body">
          <ul className="settings__categories">
            {settingsCategories.map((item, index) => (
              <li key={item.id}>
                <FocusIndicator
                  variant="fill"
                  focused={isOverlayFocused(state, SCOPE, index, 0)}
                  target={makeTarget(SCOPE, index, 0)}
                  className={`settings__category ${index === entry.category ? 'is-selected' : ''}`}
                >
                  <span>{item.label}</span>
                  <Icon name="chevronRight" />
                </FocusIndicator>
              </li>
            ))}
          </ul>

          <div className="settings__options">
            <p className="settings__description">{category.description}</p>
            <ul>
              {category.options.map((option, index) => (
                <li key={option.id}>
                  <FocusIndicator
                    variant="fill"
                    focused={isOverlayFocused(state, SCOPE, index, 1)}
                    target={makeTarget(SCOPE, index, 1)}
                    className="settings__option"
                  >
                    <span>{option.label}</span>
                    <span className="settings__value">{option.values[state.settingsValues[option.id] ?? 0]}</span>
                  </FocusIndicator>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="settings__hint">Enter: change value · ← / Esc: back</footer>
      </aside>
    </div>
  );
}
