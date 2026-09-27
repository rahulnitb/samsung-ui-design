import { useRef } from 'react';
import { useNavState } from '../navigation/NavigationContext.jsx';
import { useVerticalFocusScroll } from '../hooks/useFocusScroll.js';

/** Vertical page container that follows the focused row. Rows mark themselves with data-row. */
export default function PageScroller({ padded = false, children }) {
  const state = useNavState();
  const scrollerRef = useRef(null);
  useVerticalFocusScroll(scrollerRef, state.main.row);

  return (
    <div ref={scrollerRef} className={`page-scroller ${padded ? 'page-scroller--padded' : ''}`}>
      {children}
    </div>
  );
}
