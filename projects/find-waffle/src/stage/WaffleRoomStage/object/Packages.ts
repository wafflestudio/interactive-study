import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { KeyMap } from '../../../libs/keyboard/KeyMap';
import { ResourceLoader } from '../../../libs/resource-loader/ResourceLoader';
import { CannonManager } from '../core/cannon/CannonManager';
import { GameObject } from '../core/object/GameObject';
import { ScenarioManager } from '../core/scenario/ScenarioManager';

export class Packages extends GameObject {
  hitbox;
  constructor(
    object3D: THREE.Object3D,
    body: CANNON.Body,
    resourceLoader: ResourceLoader,
    keyMap: KeyMap,
    scenarioManager: ScenarioManager,
    cannonManager: CannonManager,
  ) {
    super('Packages', resourceLoader, keyMap, scenarioManager, cannonManager);
    this.object3D = object3D;
    this.body = body;
    this.hitbox = this.cannonManager.createInteractiveHitbox(
      this.object3D,
      0.5,
      () => {
        console.log('Packages clicked');
        this.scenarioManager.set('test2');
      },
    );
    console.log(this.cannonManager.interactiveHitboxMap);
  }
  onAnimate() {
    if (!this.body) return;
    if (this.scenarioManager.isPlot(this.hitbox?.activatedSubstage)) {
      this.cannonManager.world.contacts.forEach((contact) => {
        this.hitbox!.onActivate(contact);
      });
    }
  }
  onUnmount() {}
}

export const isPackages = (object3D: THREE.Object3D) => true;
