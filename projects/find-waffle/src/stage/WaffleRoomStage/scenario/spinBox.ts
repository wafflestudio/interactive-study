import { gsap } from 'gsap';
import * as THREE from 'three';

import { KeyMap } from '../../../libs/keyboard/KeyMap';
import { CannonManager } from '../core/cannon/CannonManager';
import { Dialogue } from '../core/dialogue/Dialogue';
import { Scenario } from '../core/scenario/ScenarioManager';
import { SceneManager } from '../core/scene/SceneManager';

export const spinboxScenario =
  (
    sceneManager: SceneManager,
    cannonManager: CannonManager,
    keyMap: KeyMap,
    dialogue: Dialogue,
    // 원하는 대로 추가
  ): Scenario =>
  (set) => [
    {
      name: 'spinbox_01',
      onMount: () => {},
    },
    {
      // 예시 코드
      name: 'spinbox_02',
      onMount: () => {
        const lookAtPoint = new THREE.Vector3(0, 0, 0);
        gsap.to(lookAtPoint, {
          duration: 3,
          x: -2,
          y: 0,
          z: -2,
          ease: 'power2.inOut',
          onUpdate: () => {
            sceneManager.currentCamera.lookAt(lookAtPoint);
          },
        });
        gsap.to(sceneManager.currentCamera.position, {
          duration: 3,
          x: 2,
          y: 2,
          z: 2,
        });

        dialogue.begin(['spinbox_02입니다'], () => {
          set('spinbox_03');
        });
      },
    },
    { name: 'spinbox_03' },
  ];
