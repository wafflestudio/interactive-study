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

    /**
     * Case 1) 수식키 자체에 기능 할당
     * e.g. Shift 만 눌렀을 때 점프한다.
     * keyMap.bind('ShiftLeft', () => { console.log('Jump!') });
     */
    if (keys.length === 1) {
      const key = keys[0];
      switch (key.toLowerCase()) {
        case 'leftshift':
        case 'shiftleft':
          modifiers = SHIFT;
          code = 'ShiftLeft';
          break;
        case 'rightshift':
        case 'shiftright':
          modifiers = SHIFT;
          code = 'ShiftRight';
          break;
        case 'leftctrl':
        case 'ctrlleft':
          modifiers = CTRL;
          code = 'ControlLeft';
          break;
        case 'rightctrl':
        case 'ctrlright':
          modifiers = CTRL;
          code = 'ControlRight';
          break;
        case 'leftalt':
        case 'altleft':
          modifiers = ALT;
          code = 'AltLeft';
          break;
        case 'rightalt':
        case 'altright':
          modifiers = ALT;
          code = 'AltRight';
          break;
        case 'leftmeta':
        case 'metaleft':
          modifiers = META;
          code = 'MetaLeft';
          break;
        case 'rightmeta':
        case 'metaright':
          modifiers = META;
          code = 'MetaRight';
          break;
      }
    }

    /**
     * Case 2) 수식키가 일반키를 보조하는 경우
     * e.g. Shift를 누른 채로 A 키를 누르면 캐릭터가 점프한다.
     * keyMap.bind('Shift+A', () => { console.log('Jump!') });
     */
    if (code === undefined) {
      for (const key of keys) {
        switch (key.toLowerCase()) {
          case 'shift':
            modifiers |= SHIFT;
            break;
          case 'ctrl':
            modifiers |= CTRL;
            break;
          case 'alt':
            modifiers |= ALT;
            break;
          case 'meta':
            modifiers |= META;
            break;
          default:
            code = findCode(key);
        }
      }
    }

    if (code === undefined) {
      console.warn('Invalid key binding', keyBinding);
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

function findCode(key: string) {
  // Special keys
  switch (key.toLowerCase()) {
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

  return key;
}
