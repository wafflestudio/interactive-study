export class KeyBindingValidationError extends Error {
  keyBinding: string;
  invalidReason: string;

  constructor(keyBinding: string, invalidReason: string) {
    super(`Invalid key binding: ${keyBinding}, reason: ${invalidReason}`);
    this.name = 'KeyBindingValidationError';
    this.keyBinding = keyBinding;
    this.invalidReason = invalidReason;
  }
}

export class EmptyKeyBindingError extends KeyBindingValidationError {
  constructor(keyBinding: string) {
    super(keyBinding, 'Empty key binding');
    this.name = 'EmptyKeyBindingError';
  }
}

export class InvalidModifierError extends KeyBindingValidationError {
  constructor(keyBinding: string, invalidModifier: string) {
    super(keyBinding, `Invalid modifier: ${invalidModifier}`);
    this.name = 'InvalidModifierError';
  }
}

export class InvalidKeyCodeError extends KeyBindingValidationError {
  constructor(keyBinding: string, invalidKeyCode: string) {
    super(keyBinding, `Invalid key code: ${invalidKeyCode}`);
    this.name = 'InvalidKeyCodeError';
  }
}
