import { KeyAction } from './KeyAction';
import { KeyBindingValidationError } from './errors';
import {
  extractModifiersFromEvent,
  findModifier,
  parseKeyBinding,
} from './utils';

export const NONE = 0b0000;
export const SHIFT = 0b0001;
export const CTRL = 0b0010;
export const ALT = 0b0100;
export const META = 0b1000;

type Callback = () => void;
type Modifier = number;
type Code = string;
type ActionTable = Map<Code, KeyAction>;
type BindingOptions = {
  preventDefault?: boolean;
  allowRepeated?: boolean;
};

export class KeyMap {
  private static _currentProfile?: KeyMap;
  private static readonly _pressedKeys: Set<string> = new Set();

  private readonly bindingTable: Map<Modifier, ActionTable>;
  private readonly releaseActionTable: ActionTable;

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
    this.bindingTable = new Map();
    this.releaseActionTable = new Map();
  }

  get pressedKeys() {
    return new Set(KeyMap._pressedKeys);
  }

  get isActivated() {
    return KeyMap._currentProfile === this;
  }

  bind(
    keyBinding: string | string[],
    pressCallback?: Callback,
    releaseCallback?: Callback,
    options: BindingOptions = {},
  ): ThisType<KeyMap> {
    // key binding 이 여러개 일 경우
    if (Array.isArray(keyBinding)) {
      for (const binding of keyBinding) {
        this.bind(binding, pressCallback, releaseCallback);
      }
      return this;
    }

    try {
      const { modifiers, code } = parseKeyBinding(keyBinding);

      const codeModifier = findModifier(
        code.match(/^(Shift|Control|Alt|Meta)/)?.[1] ?? '',
      );

      this.addKeyBinding(
        codeModifier | modifiers,
        code,
        pressCallback,
        releaseCallback,
        options,
      );
    } catch (error) {
      if (error instanceof KeyBindingValidationError) {
        console.error(error);
      }
      throw error;
    } finally {
      return this;
    }
  }

  unbind(keyBinding: string | string[]): ThisType<KeyMap> {
    if (Array.isArray(keyBinding)) {
      for (const binding of keyBinding) {
        this.unbind(binding);
      }
      return this;
    }

    try {
      const { modifiers, code } = parseKeyBinding(keyBinding);
      this.removeKeyBinding(modifiers, code);
    } catch (error) {
      if (error instanceof KeyBindingValidationError) {
        console.error(error);
      }
      throw error;
    } finally {
      return this;
    }
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
    modifier: number,
    code: string,
    pressCallback?: Callback,
    releaseCallback?: Callback,
    options: BindingOptions = {},
  ) {
    if (!pressCallback && !releaseCallback) {
      return;
    }

    const modifierMap: ActionTable =
      this.bindingTable.get(modifier) ?? new Map();

    if (modifierMap.has(code)) {
      console.warn('Overwriting existing binding');
    }

    modifierMap.set(
      code,
      new KeyAction(pressCallback, releaseCallback, options),
    );
    this.bindingTable.set(modifier, modifierMap);
  }

  private removeKeyBinding(modifier: number, code: string) {
    const modifierMap = this.bindingTable.get(modifier);
    if (!modifierMap) return;

    modifierMap.delete(code);
  }

  private handleKeyDown(event: KeyboardEvent) {
    const modifier = extractModifiersFromEvent(event);
    const action = this.bindingTable.get(modifier)?.get(event.code);

    if (!action) return;

    action.press(event);
    this.releaseActionTable.set(event.code, action);
  }

  private handleKeyUp(event: KeyboardEvent) {
    const action = this.releaseActionTable.get(event.code);
    action?.release(event);
  }
}
