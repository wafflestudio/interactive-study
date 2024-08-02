import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { KeyMap } from '../../../libs/keyboard/KeyMap';
import { ResourceLoader } from '../../../libs/resource-loader/ResourceLoader';
import { animateCharacter } from '../animation/character';
import { CannonManager } from '../core/cannon/CannonManager';
import { GameObject } from '../core/object/GameObject';
import { ScenarioManager } from '../core/scenario/ScenarioManager';
import { SceneManager } from '../core/scene/SceneManager';

export class Player extends GameObject {
  keysPressed = new Map<string, boolean>();

  constructor(
    resourceLoader: ResourceLoader,
    keyMap: KeyMap,
    sceneManager: SceneManager,
    scenarioManager: ScenarioManager,
    cannonManager: CannonManager,
  ) {
    super(
      'Player',
      resourceLoader,
      keyMap,
      sceneManager,
      scenarioManager,
      cannonManager,
    );

    this.resourceLoader.registerModel(
      'iceCream',
      '/models/WaffleRoom/models/icecream.glb',
      {
        onLoad: ({ scene: iceCream }) => {
          const scale = 0.04;
          const position = new THREE.Vector3(10, 0.1, 10);

          // wrap Cannon body
          this.body = this.cannonManager.wrap(
            [iceCream],
            scale,
            1,
            position,
            true,
          )[0];

          iceCream.position.set(position.x, position.y, position.z);
          iceCream.scale.set(scale, scale, scale);
          this.object3D = this.cannonManager.totalObjectMap.get('Scene')!.mesh;

          // Customize mesh.name of character
          const character = this.cannonManager.totalObjectMap.get('Scene');
          character!.mesh.name = 'iceCream';
          this.cannonManager.totalObjectMap.set('Scene', character!);

          // Filter collision
          this.cannonManager.filterCollision(this.body, 1, 2);

          this.sceneManager.roomScene.add(iceCream);

          this.keyMap.bind(
            'w',
            () => this.keysPressed.set('up', true),
            () => this.keysPressed.delete('up'),
          );
          this.keyMap.bind(
            's',
            () => this.keysPressed.set('down', true),
            () => this.keysPressed.delete('down'),
          );
          this.keyMap.bind(
            'a',
            () => this.keysPressed.set('left', true),
            () => this.keysPressed.delete('left'),
          );
          this.keyMap.bind(
            'd',
            () => this.keysPressed.set('right', true),
            () => this.keysPressed.delete('right'),
          );
        },
      },
    );
  }

  onAnimate(t: number) {
    if (!this.body) return;
    animateCharacter(t, this.body, this.keysPressed);
  }

  onUnmount() {
    console.log(`${this.objectName} unmounted`);
  }
}
