import * as THREE from 'three';

import { ICON_SCALE } from '../../constant';
import { RotationManager } from '../../util/RotationManager';
import { GooseIcon } from './Icon';

type Status = 'drag' | 'rotate' | 'none';

export class GooseMixIcon extends GooseIcon {
  status: Status = 'rotate';
  #rotationManager = new RotationManager({
    multiplierX: 1,
    multiplierY: 1,
    reversed: true,
  });

  constructor(object: THREE.Object3D) {
    super(object, 'FLIPME.txt');
    object.scale.set(ICON_SCALE, ICON_SCALE, ICON_SCALE);
    this.rotateX(0.4);
  }

  onMouseMove(vec: THREE.Vector3Like, e: MouseEvent): void {
    switch (this.status) {
      case 'drag':
        super.onMouseMove(vec, e);
        break;
      case 'rotate':
        this.#rotationManager.onMouseMove(e, this);
        break;
      case 'none':
        break;
    }
  }

  onMouseUp(): void {
    super.onMouseUp();

    if (this.status === 'rotate') {
      if (Math.abs(this.rotation.y - Math.PI) < 0.2) {
        this.rotation.set(0, 0, 0);
      }
      this.#rotationManager.onMouseUp();

      let tmp = new THREE.Vector3();
      this.getWorldDirection(tmp);
      let angle = THREE.MathUtils.radToDeg(
        tmp.angleTo(new THREE.Vector3(0, 0, 1)),
      );
      if (angle < 10) {
        this.rotation.set(0, 0, 0);
        this.status = 'drag';
        this.setLabel('waffle.zip', Math.PI);
      }
    }
  }
}
