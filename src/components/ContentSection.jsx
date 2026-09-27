import { Fragment, useRef } from 'react';
import { useNavState } from '../navigation/NavigationContext.jsx';
import { getRowFocus, makeTarget } from '../navigation/selectors.js';
import { useHorizontalFocusScroll } from '../hooks/useFocusScroll.js';
import './ContentSection.css';

/**
 * A titled horizontal row of focusable items. Works for page rows (scope "main")
 * and overlay rows (scope = overlay type). `renderItem(item, { focused, target }, col)`
 * must return a single element.
 */
export default function ContentSection({
  title,
  items,
  rowIndex,
  rowId,
  scope = 'main',
  renderItem,
  className = '',
}) {
  const state = useNavState();
  const trackRef = useRef(null);
  const { focusedCol, scrollCol } = getRowFocus(state, scope, rowIndex, rowId);
  useHorizontalFocusScroll(trackRef, scrollCol);

  return (
    <section
      className={`content-section ${focusedCol !== null ? 'is-row-focused' : ''} ${className}`}
      data-row={rowIndex}
    >
      {title && <h2 className="content-section__title">{title}</h2>}
      <div className="content-section__track" ref={trackRef}>
        {items.map((item, col) => (
          <Fragment key={item.id}>
            {renderItem(item, { focused: focusedCol === col, target: makeTarget(scope, rowIndex, col) }, col)}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
