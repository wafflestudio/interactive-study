import * as THREE from 'three';

import { StageManager } from '../../../../core/stage/StageManager';
import { GooseIcon } from './Icon';

export class GooseWaffleIcon extends GooseIcon {
  constructor(object: THREE.Object3D) {
    object.scale.set(0.004, 0.004, 0.004);
    super(object, 'WAFFLE');
    object.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    object.position.y += 0.1;
  }

  onMouseDown(): void {
    StageManager.instance.toHome();
  }
}
