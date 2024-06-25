const NONE = 0b0000;
const SHIFT = 0b0001;
const CTRL = 0b0010;
const ALT = 0b0100;
const META = 0b1000;

export const Modifiers = { NONE, SHIFT, CTRL, ALT, META } as const;

type Table = Map<number, Map<string, () => void>>;

export class KeyMap {
  private static _currentProfile?: KeyMap;
  private static readonly _pressedKeys: Set<string> = new Set();

  private readonly _keyDownTable: Table;
  private readonly _keyUpTable: Table;

  static {
    window.addEventListener('keydown', (event) => {
      KeyMap._pressedKeys.add(event.code);
      KeyMap._currentProfile?.handleKeyDown(event);
    });

    window.addEventListener('keyup', (event) => {
      KeyMap._pressedKeys.delete(event.code);
      KeyMap._currentProfile?.handleKeyUp(event);
    });
  }

  constructor() {
    this._keyDownTable = new Map();
    this._keyUpTable = new Map();
  }

  get pressedKeys() {
    return new Set(KeyMap._pressedKeys);
  }

  bind(
    keyBinding: string | string[],
    keyDownCallback?: () => void,
    keyUpCallback?: () => void,
  ): ThisType<KeyMap> {
    // key binding 이 여러개 일 경우
    if (Array.isArray(keyBinding)) {
      for (const binding of keyBinding) {
        this.bind(binding, keyDownCallback, keyUpCallback);
      }
      return this;
    }

    // key binding 을 분해
    const keys = keyBinding.split('+').map((key) => key.trim());
    // 수식키
    let modifiers: number = NONE;
    // 일반키
    let code: string | undefined;

    for (const key of keys) {
      modifiers |= findModifier(key);
      code = findCode(key);
    }

    // 정상적인 바인딩인데 아래 워닝이 발생하는 경우, findCode 함수에 해당 키를 대응하는 코드를 추가해야 함
    if (code === undefined) {
      console.warn('Unsupported key binding', keyBinding);
      return this;
    }

    if (keyDownCallback) {
      if (!this._keyDownTable.has(modifiers)) {
        this._keyDownTable.set(modifiers, new Map());
      }
      if (this._keyDownTable.get(modifiers)!.has(code)) {
        console.warn('Overwriting existing binding');
      }
      this._keyDownTable.get(modifiers)!.set(code, keyDownCallback);
    }

    if (keyUpCallback) {
      if (!this._keyUpTable.has(modifiers)) {
        this._keyUpTable.set(modifiers, new Map());
      }
      if (this._keyUpTable.get(modifiers)!.has(code)) {
        console.warn('Overwriting existing binding');
      }
      this._keyUpTable.get(modifiers)!.set(code, keyUpCallback);
    }

    return this;
  }

  unbind(modifier: number, code: string) {
    this._keyDownTable.get(modifier)?.delete(code);
  }

  activate() {
    KeyMap._currentProfile = this;
  }

  deactivate() {
    if (KeyMap._currentProfile === this) {
      KeyMap._currentProfile = undefined;
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    const modifier =
      (event.shiftKey ? SHIFT : NONE) |
      (event.ctrlKey ? CTRL : NONE) |
      (event.altKey ? ALT : NONE) |
      (event.metaKey ? META : NONE);
    const callback = this._keyDownTable.get(modifier)?.get(event.code);
    if (callback) {
      event.preventDefault();
      callback();
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    const modifier =
      (event.shiftKey ? SHIFT : NONE) |
      (event.ctrlKey ? CTRL : NONE) |
      (event.altKey ? ALT : NONE) |
      (event.metaKey ? META : NONE);
    const callback = this._keyUpTable.get(modifier)?.get(event.code);
    if (callback) {
      event.preventDefault();
      callback();
    }
  }
}

function findModifier(key: string) {
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

function findCode(key: string) {
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
