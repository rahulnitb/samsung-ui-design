import { useNavState } from '../navigation/NavigationContext.jsx';
import { isMainFocused, makeTarget } from '../navigation/selectors.js';
import { PAGES } from '../navigation/layouts.js';
import FocusIndicator from './FocusIndicator.jsx';
import './TopNavigation.css';

/** "For You / Live / Apps" pill. Rendered by each page at its own row index. */
export default function TopNavigation({ rowIndex, className = '' }) {
  const state = useNavState();

  return (
    <div className={`top-nav ${className}`} data-row={rowIndex}>
      <div className="top-nav__pill" role="tablist">
        {PAGES.map((page, col) => (
          <FocusIndicator
            key={page.id}
            variant="fill"
            role="tab"
            hoverFocus={false}
            focused={isMainFocused(state, rowIndex, col)}
            target={makeTarget('main', rowIndex, col)}
            className={`tab ${state.page === page.id ? 'is-active' : ''}`}
          >
            {page.label}
          </FocusIndicator>
        ))}
      </div>
    </div>
  );
}
