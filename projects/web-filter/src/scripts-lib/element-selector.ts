export class ElementSelector {
  private selectedElememt: HTMLElement | null = null;

  constructor() {
    this.bindEvents();
  }

  private handleMouseMove = (e: MouseEvent) => {
    const element = document.elementFromPoint(e.clientX, e.clientY);
    console.log(element);
  };

  private handleClick = (e: MouseEvent) => {};

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
    }
  };

  private bindEvents = () => {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('click', this.handleClick);
    window.addEventListener('keydown', this.handleKeyDown);
  };
}
