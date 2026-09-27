import { useNavDispatch } from '../navigation/NavigationContext.jsx';
import { hoverAllowed } from '../navigation/pointer.js';

/**
 * Wraps any focusable element. Focus itself lives in the navigation reducer;
 * this component only renders the focus state and routes the mouse:
 * hover = move focus here, click = move focus here + activate.
 *
 * variant:
 *  - "ring": the element itself scales and gets a bright ring (cards, images)
 *  - "fill": the element turns into a solid bright pill (text buttons, keys)
 *  - "none": a descendant with class "focus-ring" carries the visual
 * hoverFocus: set false where merely hovering should not move focus (e.g. tabs,
 * because focusing a tab switches the page).
 */
export default function FocusIndicator({
  focused,
  target,
  variant = 'ring',
  hoverFocus = true,
  className = '',
  children,
  ...rest
}) {
  const dispatch = useNavDispatch();
  const variantClass = variant === 'none' ? '' : `focus-${variant}`;

  return (
    <div
      {...rest}
      className={`focusable ${variantClass} ${focused ? 'is-focused' : ''} ${className}`}
      aria-selected={focused || undefined}
      onMouseMove={() => {
        if (hoverFocus && !focused && hoverAllowed()) dispatch({ type: 'FOCUS', target });
      }}
      onClick={(event) => {
        event.stopPropagation();
        dispatch({ type: 'CLICK', target });
      }}
    >
      {children}
    </div>
  );
}
