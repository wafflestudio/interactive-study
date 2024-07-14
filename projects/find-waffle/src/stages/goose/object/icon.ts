import * as THREE from 'three';

import { CAMERA_HEIGHT, WINDOW_ICON_SIZE } from '../constant';

export class GooseWindowIcon {
  object: THREE.Object3D;
  mouseDownHandler: () => void = () => {};

  constructor(object?: THREE.Object3D) {
    this.object = object ?? this.#createMockCube();
  }

  moveTo(pos: THREE.Vector3Like) {
    this.object.position.copy(pos);
    this.object.lookAt(0, CAMERA_HEIGHT, 0);
  }

  onMouseDown() {
    this.object.scale.set(1.1, 1.1, 1.1);
    this.mouseDownHandler();
  }

  onMouseUp() {
    this.object.scale.set(1, 1, 1);
  }

  #createMockCube(color: number = 0x666666) {
    const geometry = new THREE.BoxGeometry(
      WINDOW_ICON_SIZE,
      WINDOW_ICON_SIZE,
      WINDOW_ICON_SIZE,
    );
    const material = new THREE.MeshBasicMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }
}
