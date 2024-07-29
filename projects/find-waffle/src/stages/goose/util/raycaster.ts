import * as THREE from 'three';

export class GooseRaycaster extends THREE.Raycaster {
  #pointer = new THREE.Vector2();
  #canvasRect: DOMRect = new DOMRect();

  constructor() {
    super();
    this.onPointerMove = this.onPointerMove.bind(this);
  }

  mount() {
    addEventListener('pointermove', this.onPointerMove);
  }

  unmount() {
    removeEventListener('pointermove', this.onPointerMove);
  }

  resize(canvasRect: DOMRect) {
    this.#canvasRect = canvasRect;
  }

  animate(camera: THREE.Camera) {
    super.setFromCamera(this.#pointer, camera);
  }

  firstIntersect(object: THREE.Object3D | THREE.Object3D[]) {
    if (!Array.isArray(object)) object = [object];

    if (this.#pointerInCanvas() === false) return null;

    const intersectionList = super.intersectObjects(object);
    if (intersectionList.length === 0) return null;

    return intersectionList[0];
  }

  onPointerMove({ clientX, clientY }: MouseEvent) {
    const x =
      ((clientX - this.#canvasRect.left) / this.#canvasRect.width) * 2 - 1;
    const y =
      -((clientY - this.#canvasRect.top) / this.#canvasRect.height) * 2 + 1;

    this.#pointer.x = x;
    this.#pointer.y = y;
  }

  #pointerInCanvas() {
    let { x, y } = this.#pointer;
    return -1 <= x && x <= 1 && -1 <= y && y <= 1;
  }
}
