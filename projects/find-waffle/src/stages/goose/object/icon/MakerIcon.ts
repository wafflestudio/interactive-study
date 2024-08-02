import * as THREE from 'three';

import { ICON_SCALE } from '../../constant';
import { RotationManager } from '../../util/RotationManager';
import { GooseIcon } from './Icon';

export class GooseMakerIcon extends GooseIcon {
  #rotationManager = new RotationManager({
    multiplierX: 1,
    multiplierY: 1,
    reversed: true,
  });

  constructor(object: THREE.Object3D) {
    super(object, 'My Documents');
    object?.scale.set(ICON_SCALE, ICON_SCALE, ICON_SCALE);
  }

  onMouseMove(_vec: THREE.Vector3Like, e: MouseEvent): void {
    this.#rotationManager.onMouseMove(e, this);
  }

  onMouseUp(): void {
    super.onMouseUp();
    this.#rotationManager.onMouseUp();
  }
}
