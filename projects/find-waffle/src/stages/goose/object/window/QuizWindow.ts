import { CSS3DObject } from 'three/examples/jsm/Addons.js';

import { CAMERA_HEIGHT, WINDOW_DIST } from '../../constant';

export class QuizWindow extends CSS3DObject {
  toolbar: HTMLElement;
  heading: HTMLElement;
  button: HTMLButtonElement;
  input: HTMLInputElement;

  constructor(angle: number, imageSrc: string) {
    super(document.createElement('div'));

    this.position.set(
      WINDOW_DIST * Math.cos(angle),
      CAMERA_HEIGHT,
      WINDOW_DIST * Math.sin(angle),
    );
    this.lookAt(0, CAMERA_HEIGHT, 0);
    this.scale.set(0.015, 0.015, 0.015);

    this.element.innerHTML = innerHTML;

    this.toolbar = this.element.querySelector('p') as HTMLElement;
    this.heading = this.element.querySelector('h2') as HTMLElement;
    this.button = this.element.querySelector('button') as HTMLButtonElement;
    this.input = this.element.querySelector('input') as HTMLInputElement;

    const img = this.element.querySelector('img') as HTMLImageElement;
    img.src = imageSrc;
  }
}

const innerHTML = `<div style="display: flex; flex-direction: column; width: 266px;" class="goose">
  <p>Enter Password</p>
  <div style="background-color: #C0C0C0; padding: 6px 16px; display: flex; flex-direction: column;">
    <div style="display: flex; gap: 5px; align-items: center;">
      <img />
      <h2>Enter Password</h2>
    </div>
    <input/>
    <button>Enter</button>
  </div>
</div>`;
