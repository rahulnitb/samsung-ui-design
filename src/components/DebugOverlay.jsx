import { useNavDispatch, useNavState } from '../navigation/NavigationContext.jsx';
import { describeFocus } from '../navigation/selectors.js';
import * as pushApi from '../api/pushApi.js';
import './DebugOverlay.css';

/** Toggle with Ctrl+Shift+D. */
export default function DebugOverlay() {
  const state = useNavState();
  const dispatch = useNavDispatch();
  const focus = describeFocus(state);

  const simulateIncomingShare = () => {
    pushApi.getIncomingShare().then(({ id, items }) => dispatch({ type: 'WS_CONTENT_RECEIVED', id, items }));
  };
  const overlayStack = state.overlays.map((overlay) => overlay.type).join(' › ') || 'none';

  const entries = [
    ['Page', state.page],
    ['Focus area', focus.area],
    ['Focus row', `${focus.row} (${focus.rowId})`],
    ['Focus index', focus.col],
    ['Overlays', overlayStack],
    ['Hero slide', state.heroIndex],
    ['Last key', state.lastKey],
  ];

  return (
    <div className="debug" aria-hidden="true">
      <div className="debug__title">NAV DEBUG · Ctrl+Shift+D</div>
      {entries.map(([label, value]) => (
        <div key={label} className="debug__row">
          <span>{label}</span>
          <span>{String(value)}</span>
        </div>
      ))}
      <button type="button" className="debug__button" onClick={simulateIncomingShare}>
        Simulate incoming share
      </button>
    </div>
  );
}
