import { useNavState } from '../navigation/NavigationContext.jsx';
import { isOverlayFocused, makeTarget } from '../navigation/selectors.js';
import FocusIndicator from './FocusIndicator.jsx';
import Icon from './Icon.jsx';
import './OnScreenKeyboard.css';

/**
 * TV-style on-screen keyboard. `rows` are keyboard row descriptors from layouts.js;
 * `firstRowIndex` is where they start within the overlay's focus grid.
 */
export default function OnScreenKeyboard({ rows, firstRowIndex, scope }) {
  const state = useNavState();

  return (
    <div className="osk" role="group" aria-label="On-screen keyboard">
      {rows.map((row, offset) => {
        const rowIndex = firstRowIndex + offset;
        return (
          <div key={row.id} className="osk__row">
            {row.items.map((key, col) => (
              <FocusIndicator
                key={key.id}
                variant="fill"
                focused={isOverlayFocused(state, scope, rowIndex, col)}
                target={makeTarget(scope, rowIndex, col)}
                className={`osk__key ${key.type !== 'char' ? 'osk__key--action' : ''}`}
                style={{ gridColumn: `span ${key.width ?? 1}` }}
              >
                {key.icon && <Icon name={key.icon} />}
                {key.type === 'char' ? key.label : <span>{key.label}</span>}
              </FocusIndicator>
            ))}
          </div>
        );
      })}
    </div>
  );
}
