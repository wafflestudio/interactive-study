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
  animationMixer?: THREE.AnimationMixer;
  pendingActions: [] = [];
  actionsMap: Map<string, THREE.AnimationAction> = new Map();
  currentAction?: { key: string; action: THREE.AnimationAction };

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
      '/models/IceCream/icecream_standing_edit.glb',
      {
        onLoad: (gltf) => {
          const iceCream = gltf.scene;

          const scale = 2;
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

          if (!this.animationMixer)
            this.animationMixer = new THREE.AnimationMixer(iceCream);
          iceCream.traverse((child) => {
            if (child.isBone) {
              const helper = new THREE.SkeletonHelper(child);
              this.sceneManager.roomScene.add(helper);
            }
          });

          // this.actionsMap.idle =
          const clips = gltf.animations;
          const clip = clips[0];
          this.actionsMap.set('idle', this.animationMixer.clipAction(clip));
          this.currentAction = {
            key: 'idle',
            action: this.actionsMap.get('idle')!,
          };
          this.currentAction?.action.play();
        },
      },
    );

    this.resourceLoader.registerModel(
      'iceCream_walking',
      '/models/IceCream/icecream_walking.glb',
      {
        onLoad: (gltf) => {
          if (!this.animationMixer)
            this.animationMixer = new THREE.AnimationMixer(gltf.scene);
          const clips = gltf.animations;
          const clip = clips[0];
          const action = this.animationMixer.clipAction(clip);
          action.loop = THREE.LoopPingPong;
          this.actionsMap.set('walking', action);
        },
      },
    );
    this.resourceLoader.registerModel(
      'iceCream_action',
      '/models/IceCream/icecream_action.glb',
      {
        onLoad: (gltf) => {
          if (!this.animationMixer)
            this.animationMixer = new THREE.AnimationMixer(gltf.scene);
          const clips = gltf.animations;
          const clip = clips[0];
          this.actionsMap.set('action', this.animationMixer!.clipAction(clip));
        },
      },
    );
  }

  onUnmount() {
    console.log(`${this.objectName} unmounted`);
  }

  changeAction(actionKey: string) {
    if (this.currentAction?.key === actionKey) return;

    const oldAction = this.currentAction?.action;
    const newAction = this.actionsMap.get(actionKey);
    if (!newAction) return;
    if (oldAction) {
      oldAction.stop();
      newAction.crossFadeFrom(oldAction, 0.5, true);
    }
    newAction.reset();
    this.currentAction = { key: actionKey, action: newAction };
    this.currentAction?.action.play();
  }

  onAnimate(t: number) {
    if (!this.body) return;
    animateCharacter(t, this.body, this.keysPressed);

    if (this.keysPressed.size > 0) {
      this.changeAction('walking');
    } else {
      this.changeAction('idle');
    }

    this.animationMixer?.update(t);
  }
}
