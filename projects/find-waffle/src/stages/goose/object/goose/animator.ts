import * as THREE from 'three';

import { CAMERA_FOV, GOOSE_SIZE } from '../../constant';

export abstract class GooseAnimator {
  surface: THREE.Object3D;
  oldPos?: THREE.Vector3;
  lastTime?: DOMHighResTimeStamp;
  speed = 1;

  static #rayOrigin = new THREE.Vector3();
  static #rayDirection = new THREE.Vector3(0, -1, 0);
  static #raycaster = new THREE.Raycaster();

  constructor(surface: THREE.Object3D) {
    this.surface = surface;
  }

  abstract animate(time: DOMHighResTimeStamp): {
    pos: THREE.Vector3;
    slope: number;
  };

  getSurfaceY(x: number, z: number) {
    const raycaster = GooseAnimator.#raycaster;
    const rayOrigin = GooseAnimator.#rayOrigin;
    const rayDirection = GooseAnimator.#rayDirection;

    rayOrigin.set(x, 9999, z);
    raycaster.set(rayOrigin, rayDirection);

    const intersectionList = raycaster.intersectObject(this.surface);
    if (intersectionList.length === 0) return 9999;

    return intersectionList[0].point.y;
  }

  getSlope(newPos: THREE.Vector3) {
    if (this.oldPos === undefined) return 0;

    const { x: x1, y: y1, z: z1 } = this.oldPos;
    const { x: x2, y: y2, z: z2 } = newPos;

    const dist = Math.sqrt((x1 - x2) ** 2 + (z1 - z2) ** 2);
    const height = y2 - y1;

    return Math.atan2(height, dist);
  }
}

export class GooseCircularAnimator extends GooseAnimator {
  #radius: number;
  _angle: number = 0;

  get angle() {
    return this._angle;
  }

  set angle(newValue) {
    this._angle = (newValue + 2 * Math.PI) % (2 * Math.PI);
  }

  constructor(surface: THREE.Object3D, radius: number, startAngle: number) {
    super(surface);
    this.#radius = radius;
    this.angle = startAngle;
  }

  animate(time: DOMHighResTimeStamp) {
    if (this.lastTime === undefined) {
      this.lastTime = time;
    }

    const delta = time - this.lastTime;
    this.lastTime = time;
    this.angle += (delta / 10000) * this.speed * (this.#inFOV() ? 1 : 30);

    const x = this.#radius * Math.cos(this.angle);
    const z = this.#radius * Math.sin(this.angle);
    const y = this.getSurfaceY(x, z) + GOOSE_SIZE / 2;

    const newPos = new THREE.Vector3(x, y, z);
    const slope = this.getSlope(newPos);
    this.oldPos = newPos;

    return { pos: newPos, slope };
  }

  #inFOV() {
    const fovInRadian = CAMERA_FOV / 2 + Math.PI / 32;
    return 2 * Math.PI - fovInRadian < this.angle || this.angle < fovInRadian;
  }
}
