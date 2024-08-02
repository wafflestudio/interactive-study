import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { KeyMap } from '../../../libs/keyboard/KeyMap';
import { ResourceLoader } from '../../../libs/resource-loader/ResourceLoader';
import { CannonManager } from '../core/cannon/CannonManager';
import { InteractiveHitbox } from '../core/cannon/CannonManager';
import { GameObject } from '../core/object/GameObject';
import { ScenarioManager } from '../core/scenario/ScenarioManager';
import { SceneManager } from '../core/scene/SceneManager';

export class Packages extends GameObject {
  hitboxes: InteractiveHitbox[] = [];

  constructor(
    object3D: THREE.Object3D,
    body: CANNON.Body,
    resourceLoader: ResourceLoader,
    keyMap: KeyMap,
    sceneManager: SceneManager,
    scenarioManager: ScenarioManager,
    cannonManager: CannonManager,
  ) {
    super(
      'Packages',
      resourceLoader,
      keyMap,
      sceneManager,
      scenarioManager,
      cannonManager,
    );
    this.object3D = object3D;
    this.body = body;
    this.hitboxes.push(
      this.cannonManager.createInteractiveHitbox(
        this.object3D,
        2.5,
        'spinbox_02',
        (contact) => {
          if (contact.bi === this.body || contact.bj === this.body) {
            this.scenarioManager.set('spinbox_03');
          }
        },
      ),
    );
  }

  onAnimate() {
    if (!this.body) return;
    this.hitboxes.forEach((hitbox) => {
      if (this.scenarioManager.isPlot(hitbox.activatedPlot)) {
        this.cannonManager.world.contacts.forEach((contact) => {
          hitbox.onActivate(contact);
        });
      }
    });
  }

  onUnmount() {}
}

export const isPackages = (object3D: THREE.Object3D) => true;
