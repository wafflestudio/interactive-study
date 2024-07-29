import * as THREE from 'three';

import {
  CAMERA_DRAG_DENOM,
  CAMERA_FOV,
  CAMERA_HEIGHT,
  SNAP_DISTANCE,
} from '../../constant';
import { angleDiff, normalizeAngle } from '../../util/math';

/** 수평 회전 및 각도 제한이 가능한 카메라 */
export class GooseCamera extends THREE.PerspectiveCamera {
  maxAngle = 2 * Math.PI;

  #angle = 0;
  #prevMouseX?: number;

  constructor() {
    super(THREE.MathUtils.radToDeg(CAMERA_FOV));
  }

  mount() {
    this.position.set(0, CAMERA_HEIGHT, 0);
    this.rotate(0);
  }

  onMouseMove(e: MouseEvent) {
    this.#prevMouseX ??= e.clientX;

    const angle = -(e.clientX - this.#prevMouseX) / CAMERA_DRAG_DENOM;
    this.rotate(this.#angle + angle);

    this.#prevMouseX = e.clientX;
  }

  onMouseUp() {
    this.#snap();
    this.#prevMouseX = undefined;
  }

  /** MEMO: X축에서 시작해 Z축 방향으로 각이 증가합니다. */
  rotate(newValue: number) {
    newValue = normalizeAngle(newValue);

    // 최대값을 넘지 않게 처리
    if (this.maxAngle < newValue) {
      const diff1 = newValue - this.maxAngle;
      const diff2 = 2 * Math.PI - newValue;
      newValue = diff1 < diff2 ? this.maxAngle : 0;
    }

    let x = Math.cos(newValue);
    let y = CAMERA_HEIGHT;
    let z = Math.sin(newValue);
    this.lookAt(x, y, z);

    this.#angle = newValue;
  }

  #snap() {
    if (angleDiff(this.#angle, 0) < SNAP_DISTANCE) {
      this.rotate(0);
    } else if (angleDiff(this.#angle, Math.PI) < SNAP_DISTANCE) {
      this.rotate(Math.PI);
    }
  }
}
