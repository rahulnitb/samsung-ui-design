import { useRef } from 'react';
import { useNavState } from '../navigation/NavigationContext.jsx';
import { getSearchRows, SEARCH_FIRST_KEY_ROW, SEARCH_RESULTS_ROW } from '../navigation/layouts.js';
import { findOverlay, isOverlayFocused, makeTarget } from '../navigation/selectors.js';
import { usePresence } from '../hooks/usePresence.js';
import { useNow } from '../hooks/useNow.js';
import { useVerticalFocusScroll } from '../hooks/useFocusScroll.js';
import FocusIndicator from './FocusIndicator.jsx';
import OnScreenKeyboard from './OnScreenKeyboard.jsx';
import ContentSection from './ContentSection.jsx';
import ContentCard from './ContentCard.jsx';
import ChannelCard from './ChannelCard.jsx';
import AppIcon from './AppIcon.jsx';
import Icon from './Icon.jsx';
import './SearchOverlay.css';

const SCOPE = 'search';

// One universal query, grouped into result rows by content type — movies/shows, live
// channels, apps — the way Samsung's own Smart Hub search groups its results.
const RESULT_RENDERERS = {
  movies: (item, focus) => <ContentCard item={item} variant="compact" {...focus} />,
  channels: (channel, focus, now) => <ChannelCard channel={channel} now={now} {...focus} />,
  apps: (app, focus) => <AppIcon app={app} shape="round" showName {...focus} />,
};

export default function SearchOverlay() {
  const state = useNavState();
  const { mounted, closing } = usePresence(Boolean(findOverlay(state, SCOPE)));
  const now = useNow(30000);
  const rightRef = useRef(null);
  const overlay = findOverlay(state, SCOPE);
  useVerticalFocusScroll(rightRef, overlay?.row ?? 0);
  if (!mounted) return null;

  const rows = getSearchRows(state.searchQuery);
  const [headerRow] = rows;
  const keyboardRows = rows.slice(SEARCH_FIRST_KEY_ROW, SEARCH_RESULTS_ROW);
  const resultRows = rows.slice(SEARCH_RESULTS_ROW);

  const headerButton = (col) => {
    const item = headerRow.items[col];
    return (
      <FocusIndicator
        variant="fill"
        focused={isOverlayFocused(state, SCOPE, 0, col)}
        target={makeTarget(SCOPE, 0, col)}
        className="pill-button"
      >
        <Icon name={item.icon} />
        {item.label}
      </FocusIndicator>
    );
  };

  return (
    <div className={`search-overlay overlay-anim ${closing ? 'is-closing' : ''}`} role="dialog" aria-label="Search">
      <div className="search-overlay__header">
        {headerButton(0)}
        <div className="search-field">
          <Icon name="search" className="search-field__icon" />
          {state.searchQuery ? (
            <span className="search-field__text">{state.searchQuery}</span>
          ) : (
            <span className="search-field__placeholder">Search movies, shows, channels and apps</span>
          )}
          <span className="search-field__caret" />
        </div>
        {headerButton(1)}
      </div>

      <div className="search-overlay__body">
        <div className="search-overlay__left">
          <OnScreenKeyboard rows={keyboardRows} firstRowIndex={SEARCH_FIRST_KEY_ROW} scope={SCOPE} />
          <p className="search-overlay__hint">
            Type with your keyboard, or use the arrows and Enter. Esc closes search.
          </p>
        </div>

        <div className="search-overlay__right" ref={rightRef}>
          {resultRows.length === 0 ? (
            <div className="search-overlay__empty">No results match “{state.searchQuery.trim()}”</div>
          ) : (
            resultRows.map((row, offset) => {
              const rowIndex = SEARCH_RESULTS_ROW + offset;
              return (
                <ContentSection
                  key={row.id}
                  title={`${row.title} (${row.items.length})`}
                  items={row.items}
                  rowIndex={rowIndex}
                  rowId={row.id}
                  scope={SCOPE}
                  renderItem={(item, focus) => RESULT_RENDERERS[row.resultType](item, focus, now)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
