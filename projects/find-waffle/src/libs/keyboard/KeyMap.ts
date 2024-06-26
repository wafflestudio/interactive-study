import { KeyBindingValidationError } from './errors';
import {
  findCallbackThenExecute,
  findModifier,
  parseKeyBinding,
} from './utils';

export const NONE = 0b0000;
export const SHIFT = 0b0001;
export const CTRL = 0b0010;
export const ALT = 0b0100;
export const META = 0b1000;

export type Table = Map<number, Map<string, () => void>>;

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

  get isActivated() {
    return KeyMap._currentProfile === this;
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

    try {
      const { modifiers, code } = parseKeyBinding(keyBinding);

      this.addKeyBinding(this._keyDownTable, modifiers, code, keyDownCallback);
      this.addKeyBinding(this._keyUpTable, modifiers, code, keyUpCallback);

      return this;
    } catch (error) {
      if (error instanceof KeyBindingValidationError) {
        console.error(error);
        return this;
      }
      throw error;
    }
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

  private addKeyBinding(
    table: Table,
    modifier: number,
    code: string,
    callback?: () => void,
  ) {
    if (!callback) {
      return;
    }

    if (!table.has(modifier)) {
      table.set(modifier, new Map());
    }

    if (table.get(modifier)!.has(code)) {
      console.warn('Overwriting existing binding');
    }

    table.get(modifier)!.set(code, callback);
  }

  private handleKeyDown(event: KeyboardEvent) {
    findCallbackThenExecute(event, this._keyDownTable);
  }

  private handleKeyUp(event: KeyboardEvent) {
    findCallbackThenExecute(event, this._keyUpTable);
  }
}
