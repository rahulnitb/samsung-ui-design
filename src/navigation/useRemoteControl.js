import { useEffect, useRef } from 'react';
import { keyEventToCommand, describeKey } from './keyMap.js';
import { topOverlay } from './selectors.js';
import { noteKeyPress } from './pointer.js';

// Held arrow keys auto-repeat; throttle so focus moves at a readable pace.
const REPEAT_INTERVAL_MS = 70;
// One focus step per wheel "notch"; trackpads fire many small events.
const WHEEL_INTERVAL_MS = 180;

/** Single global key listener that turns keyboard/remote input into reducer actions. */
export function useRemoteControl(state, dispatch) {
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    let lastRepeatAt = 0;

    function onKeyDown(event) {
      noteKeyPress();
      const key = describeKey(event);

      if (event.ctrlKey && event.shiftKey && event.code === 'KeyD') {
        event.preventDefault();
        dispatch({ type: 'TOGGLE_DEBUG', key });
        return;
      }
      // Leave browser shortcuts (reload, devtools, …) alone.
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      const current = stateRef.current;

      // Development convenience: type into the search box with a physical keyboard.
      if (topOverlay(current)?.type === 'search') {
        if (event.key === 'Backspace') {
          event.preventDefault();
          dispatch({ type: 'DELETE_CHAR', key });
          return;
        }
        if (event.key.length === 1) {
          event.preventDefault();
          dispatch({ type: 'TYPE_CHAR', char: event.key.toLowerCase(), key });
          return;
        }
      }

      const command = keyEventToCommand(event);
      if (!command) {
        if (current.debug) dispatch({ type: 'KEY_LOGGED', key });
        return;
      }
      event.preventDefault();

      if (event.repeat) {
        if (command === 'enter' || command === 'back') return;
        const now = performance.now();
        if (now - lastRepeatAt < REPEAT_INTERVAL_MS) return;
        lastRepeatAt = now;
      }

      dispatch({ type: 'REMOTE', command, key });
    }

    // Mouse wheel steps focus like the arrow keys (Shift or a horizontal wheel = left/right).
    let lastWheelAt = 0;
    function onWheel(event) {
      if (event.ctrlKey) return; // keep browser zoom
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheelAt < WHEEL_INTERVAL_MS) return;

      const horizontal = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = horizontal ? event.deltaX || event.deltaY : event.deltaY;
      if (Math.abs(delta) < 4) return;
      lastWheelAt = now;
      noteKeyPress(); // content scrolls under the pointer; don't let hover undo this step

      let command;
      if (horizontal) command = delta > 0 ? 'right' : 'left';
      else command = delta > 0 ? 'down' : 'up';
      dispatch({ type: 'REMOTE', command, key: `Wheel ${command}` });
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('wheel', onWheel);
    };
  }, [dispatch]);
}
