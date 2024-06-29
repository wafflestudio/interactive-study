type Callback = () => void;
type Options = {
  preventDefault?: boolean;
  allowRepeated?: boolean;
};

export class KeyAction {
  private preventDefault: boolean;
  private allowRepeated: boolean;
  private pressCallback?: Callback;
  private releaseCallback?: Callback;

  constructor(
    pressCallback?: Callback,
    releaseCallback?: Callback,
    options: Options = {},
  ) {
    this.pressCallback = pressCallback;
    this.releaseCallback = releaseCallback;
    this.preventDefault = options.preventDefault ?? true;
    this.allowRepeated = options.allowRepeated ?? false;
  }

  press(event: KeyboardEvent) {
    if (!this.pressCallback) return;
    if (!this.allowRepeated && event.repeat) return;

    if (this.preventDefault) event.preventDefault();
    this.pressCallback();
  }

  release(event: KeyboardEvent) {
    if (!this.releaseCallback) return;

    if (this.preventDefault) event.preventDefault();
    this.releaseCallback();
  }
}
