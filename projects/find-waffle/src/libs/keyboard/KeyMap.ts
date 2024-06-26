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
type BindingTable = Map<Modifier, Map<Code, [Callback?, Callback?]>>;
type ReleaseCallbackTable = Map<Code, Callback>;

export class KeyMap {
  private static _currentProfile?: KeyMap;
  private static readonly _pressedKeys: Set<string> = new Set();

  private readonly bindingTable: BindingTable;
  private readonly releaseCallbackTable: ReleaseCallbackTable;

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
    this.releaseCallbackTable = new Map();
  }

  get pressedKeys() {
    return new Set(KeyMap._pressedKeys);
  }

  get isActivated() {
    return KeyMap._currentProfile === this;
  }

  bind(
    keyBinding: string | string[],
    pressCallback?: () => void,
    releaseCallback?: () => void,
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
        (codeModifier ?? modifiers) | modifiers, // == modifiers 또는 (codeModifier | modifiers)
        code,
        pressCallback,
        releaseCallback,
      );

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
    this.bindingTable.get(modifier)?.delete(code);
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
    pressCallback?: () => void,
    releaseCallback?: () => void,
  ) {
    if (!pressCallback && !releaseCallback) {
      return;
    }

    if (!this.bindingTable.has(modifier)) {
      this.bindingTable.set(modifier, new Map());
    }

    if (this.bindingTable.get(modifier)!.has(code)) {
      console.warn('Overwriting existing binding');
    }

    this.bindingTable
      .get(modifier)!
      .set(code, [pressCallback, releaseCallback]);
  }

  private handleKeyDown(event: KeyboardEvent) {
    const modifier = extractModifiersFromEvent(event);
    const [pressCallback, releaseCallback] =
      this.bindingTable.get(modifier)?.get(event.code) ?? [];
    if (pressCallback) {
      event.preventDefault();
      pressCallback();
    }
    if (releaseCallback) {
      this.releaseCallbackTable.set(event.code, releaseCallback);
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    const releaseCallback = this.releaseCallbackTable.get(event.code);
    if (releaseCallback) {
      event.preventDefault();
      releaseCallback();
      this.releaseCallbackTable.delete(event.code);
    }
  }
}
