import * as THREE from 'three';

import { CAMERA_FOV, CAMERA_HEIGHT } from '../constant';

export class GooseCamera {
  object = new THREE.PerspectiveCamera(CAMERA_FOV);
  #angle = 0;

  mount() {
    this.object.position.set(0, CAMERA_HEIGHT, 0);
    this.angle = 0;
  }

  get angle() {
    return this.#angle;
  }

  /**
   * 카메라의 시선(?)은 항상 지표면과 수평으로 유지됩니다.
   * X축에서 시작해 Z축 방향으로 각이 증가합니다.
   */
  set angle(newValue) {
    let x = Math.cos(newValue);
    let y = CAMERA_HEIGHT;
    let z = Math.sin(newValue);

    this.object.lookAt(x, y, z);

    const tau = Math.PI * 2;
    this.#angle = (tau + newValue) % tau;
  }

  /** TODO: 유틸 함수로 수정 */
  handleResize() {
    this.object.aspect = innerWidth / innerHeight;
    this.object.updateProjectionMatrix();
  }
}
