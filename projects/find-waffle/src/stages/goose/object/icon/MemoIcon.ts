import * as THREE from 'three';

import { GooseIcon } from './Icon';

export class MemoIcon extends GooseIcon {
  constructor(object: THREE.Object3D) {
    super(object, 'Memo');
    object.scale.set(0.003, 0.003, 0.003);
  }

  onMouseMove(_vec: THREE.Vector3Like, _e: MouseEvent): void {
    return;
  }
}
