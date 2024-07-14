import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';

import { GooseRaycaster } from '../raycaster';

export class GooseHill {
  onMouseMove: (delta: number) => void = () => {};
  onMouseUp: () => void = () => {};
  object: THREE.Object3D;

  #raycaster: GooseRaycaster;
  #prevX: number = 0;

  constructor(gltf: GLTF, raycaster: GooseRaycaster) {
    this.object = gltf.scene.children[0];
    this.#raycaster = raycaster;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    addEventListener('mousedown', this.handleMouseDown);
  }

  dispose() {
    removeEventListener('mousedown', this.handleMouseDown);
  }

  handleMouseDown(e: MouseEvent) {
    // TODO: 앞에 아이콘이 있으면 회전 방지
    const intersectionList = this.#raycaster.intersectObject(this.object);
    if (intersectionList.length === 0) return;

    this.#prevX = e.clientX;
    addEventListener('mousemove', this.handleMouseMove);
    addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove({ clientX }: MouseEvent) {
    this.onMouseMove(clientX - this.#prevX);
    this.#prevX = clientX;
  }

  handleMouseUp() {
    removeEventListener('mousemove', this.handleMouseMove);
    removeEventListener('mouseup', this.handleMouseUp);
    this.onMouseUp();
  }
}
