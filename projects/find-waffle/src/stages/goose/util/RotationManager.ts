import * as THREE from 'three';

export class RotationManager {
  #prev?: { x: number; y: number };
  #multiplier: { x: number; y: number };
  #reversed: boolean;

  constructor(options?: {
    multiplierX: number;
    multiplierY: number;
    reversed: boolean;
  }) {
    this.#multiplier = {
      x: options?.multiplierX ?? 1,
      y: options?.multiplierY ?? 1,
    };
    this.#reversed = options?.reversed ?? false;
  }

  onMouseMove(e: MouseEvent, object: THREE.Object3D) {
    const { clientX, clientY } = e;

    if (this.#prev === undefined) {
      this.#prev = { x: clientX, y: clientY };
      return;
    }

    object.rotateOnWorldAxis(
      new THREE.Vector3(0, 1, 0),
      ((clientX - this.#prev.x) / 100) * this.#multiplier.x,
    );

    object.rotateOnWorldAxis(
      new THREE.Vector3(0, 0, 1),
      ((clientY - this.#prev.y) / 100) *
        this.#multiplier.y *
        (this.#reversed ? -1 : 1),
    );

    this.#prev = { x: clientX, y: clientY };
  }

  onMouseUp() {
    this.#prev = undefined;
  }
}
