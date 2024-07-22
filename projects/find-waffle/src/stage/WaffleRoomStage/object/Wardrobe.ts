import * as THREE from 'three';

import { KeyMap } from '../../../libs/keyboard/KeyMap';
import { ResourceLoader } from '../../../libs/resource-loader/ResourceLoader';
import { CannonManager } from '../core/cannon/CannonManager';
import { GameObject } from '../core/object/GameObject';
import { ScenarioManager } from '../core/scenario/ScenarioManager';

export class Wardrobe extends GameObject {
  public object3D?: THREE.Object3D;
  constructor(
    object3D: THREE.Object3D,
    resourceLoader: ResourceLoader,
    keyMap: KeyMap,
    scenarioManager: ScenarioManager,
    cannonManager: CannonManager,
  ) {
    super('Wardrobe', resourceLoader, keyMap, scenarioManager, cannonManager);
    this.object3D = object3D;
  }
  onAnimate() {}
  onUnmount() {}
}

export const isWardrobe = (object3D: THREE.Object3D) => true;
