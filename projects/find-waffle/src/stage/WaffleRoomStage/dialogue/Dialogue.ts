export class Dialogue {
  public element?: HTMLElement;
  public queue: string[] = [];
  public endCallback?: () => void;
  public isAnimating = false;

  constructor({ app }: { app: HTMLElement }) {
    const element = app.querySelector('#dialogue-wrapper');
    if (element) {
      this.element = element as HTMLElement;
      return;
    }
    const wrapper = document.createElement('div');
    wrapper.id = 'dialogue-wrapper';
    app.appendChild(wrapper);
    this.element = wrapper;
  }

  public begin(queue: string[], onEndDialogue?: () => void) {
    this.queue = queue;
    this.endCallback = onEndDialogue;
    this.element?.classList.remove('invisible');
    this.next();
  }
  public next() {
    if (this.isAnimating) return;
    if (this.queue.length === 0) {
      if (this.endCallback) this.endCallback();
      this.endCallback = undefined;
      this.element?.classList.add('invisible');
      return;
    }

    const text = this.queue.shift();
    if (!text) return;

    const animate = (text: string, index: number) =>
      setTimeout(() => {
        const sliced = text.slice(0, index);
        if (this.element) this.element.innerHTML = sliced;
        if (index >= text.length) {
          this.isAnimating = false;
        } else {
          this.isAnimating = true;
          animate(text, index + 1);
        }
      }, 100);

    animate(text, 0);
  }

  public dispose() {
    this.element?.remove();
  }
}
