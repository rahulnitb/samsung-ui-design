// Maps keyboard / TV remote events to the six logical remote commands.

const KEY_COMMANDS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Enter: 'enter',
  ' ': 'enter',
  Escape: 'back',
  Backspace: 'back',
  GoBack: 'back',
  BrowserBack: 'back',
  XF86Back: 'back',
};

// Fallback for TV browsers that report only keyCodes (10009 = Tizen Back, 461 = webOS Back).
const KEYCODE_COMMANDS = {
  13: 'enter',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  10009: 'back',
  461: 'back',
};

export function keyEventToCommand(event) {
  return KEY_COMMANDS[event.key] ?? KEYCODE_COMMANDS[event.keyCode] ?? null;
}

export function describeKey(event) {
  const modifiers = [event.ctrlKey && 'Ctrl', event.shiftKey && 'Shift', event.altKey && 'Alt'].filter(Boolean);
  const name = event.key === ' ' ? 'Space' : event.key;
  return `${[...modifiers, name].join('+')} (${event.keyCode})`;
}
