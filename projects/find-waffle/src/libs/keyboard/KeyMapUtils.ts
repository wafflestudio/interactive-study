import { ALT, CTRL, META, NONE, SHIFT, Table } from './KeyMap';

export function findModifier(key: string) {
  switch (key.toLowerCase()) {
    case 'shift':
    case 'leftshift':
    case 'shiftleft':
      return SHIFT;
    case 'ctrl':
    case 'leftctrl':
    case 'ctrlleft':
      return CTRL;
    case 'alt':
    case 'leftalt':
    case 'altleft':
      return ALT;
    case 'meta':
    case 'leftmeta':
    case 'metaleft':
      return META;
    default:
      return NONE;
  }
}

export function findCode(key: string) {
  // Special keys
  switch (key.toLowerCase()) {
    case 'leftshift':
    case 'shiftleft':
      return 'ShiftLeft';
    case 'rightshift':
    case 'shiftright':
      return 'ShiftRight';
    case 'leftctrl':
    case 'ctrlleft':
      return 'ControlLeft';
    case 'rightctrl':
    case 'ctrlright':
      return 'ControlRight';
    case 'leftalt':
    case 'altleft':
      return 'AltLeft';
    case 'rightalt':
    case 'altright':
      return 'AltRight';
    case 'leftmeta':
    case 'metaleft':
      return 'MetaLeft';
    case 'rightmeta':
    case 'metaright':
      return 'MetaRight';
    case 'space':
      return 'Space';
    case 'enter':
      return 'Enter';
    case 'tab':
      return 'Tab';
    case 'backspace':
      return 'Backspace';
    case 'delete':
      return 'Delete';
    case 'esc':
    case 'escape':
      return 'Escape';
    case '<-':
    case '←':
    case 'arrowleft':
    case 'leftarrow':
      return 'ArrowLeft';
    case '->':
    case '→':
    case 'arrowright':
    case 'rightarrow':
      return 'ArrowRight';
    case '↑':
    case 'arrowup':
    case 'uparrow':
      return 'ArrowUp';
    case '↓':
    case 'arrowdown':
    case 'downarrow':
      return 'ArrowDown';
    case '`':
      return 'Backquote';
    case '-':
      return 'Minus';
    case '=':
      return 'Equal';
    case '[':
      return 'BracketLeft';
    case ']':
      return 'BracketRight';
    case '\\':
      return 'Backslash';
    case ';':
      return 'Semicolon';
    case "'":
      return 'Quote';
    case ',':
      return 'Comma';
    case '.':
      return 'Period';
    case '/':
      return 'Slash';
  }

  // F1 ~ F12
  if (key.match(/^F\d{1,2}$/i)) {
    return key.toUpperCase();
  }

  // Alphabets
  if (key.match(/^[a-z]$/i)) {
    return `Key${key.toUpperCase()}`;
  }

  // Digits
  if (key.match(/^\d$/)) {
    return `Digit${key}`;
  }
}

function extractModifiersFromEvent(event: KeyboardEvent) {
  return (
    (event.shiftKey ? SHIFT : NONE) |
    (event.ctrlKey ? CTRL : NONE) |
    (event.altKey ? ALT : NONE) |
    (event.metaKey ? META : NONE)
  );
}

export function findCallbackThenExecute(event: KeyboardEvent, table: Table) {
  const modifier = extractModifiersFromEvent(event);
  const callback = table.get(modifier)?.get(event.code);
  if (callback) {
    event.preventDefault();
    callback();
  }
}
