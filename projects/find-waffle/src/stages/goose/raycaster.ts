import * as THREE from 'three';

export class GooseRaycaster {
  #raycaster = new THREE.Raycaster();
  #pointer = new THREE.Vector2();

  constructor() {
    this.onPointerMove = this.onPointerMove.bind(this);
  }

  mount() {
    addEventListener('pointermove', this.onPointerMove);
  }

  unmount() {
    removeEventListener('pointermove', this.onPointerMove);
  }

  setFromCamera(camera: THREE.Camera) {
    this.#raycaster.setFromCamera(this.#pointer, camera);
  }

  intersectObject(object: THREE.Object3D) {
    return this.#raycaster.intersectObject(object);
  }

  intersectObjects(objects: THREE.Object3D[]) {
    return this.#raycaster.intersectObjects(objects);
  }

  onPointerMove({ clientX, clientY }: MouseEvent) {
    const x = (clientX / innerWidth) * 2 - 1;
    const y = -(clientY / innerHeight) * 2 + 1;

    this.#pointer.x = x;
    this.#pointer.y = y;
  }
}
