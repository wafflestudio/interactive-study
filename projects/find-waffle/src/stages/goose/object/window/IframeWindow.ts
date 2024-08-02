import { CSS3DObject } from 'three/examples/jsm/Addons.js';

import { CAMERA_HEIGHT, WINDOW_DIST } from '../../constant';

export class HTMLWindow extends CSS3DObject {
  constructor(angle: number, html: string) {
    const element = document.createElement('div');
    element.className = 'goose';

    super(element);
    this.element.innerHTML = html;

    this.position.set(
      WINDOW_DIST * Math.cos(angle),
      CAMERA_HEIGHT,
      WINDOW_DIST * Math.sin(angle),
    );
    this.lookAt(0, CAMERA_HEIGHT, 0);
    this.scale.set(0.01, 0.01, 0.01);
  }
}
