import * as THREE from 'three';

import { CannonManager } from '../cannon/CannonManager';

export class PropObject {
  constructor(
    public object3D: THREE.Object3D,
    public cannonManager: CannonManager,
  ) {}
}

export const isProp = (object3D: THREE.Object3D) => true;
