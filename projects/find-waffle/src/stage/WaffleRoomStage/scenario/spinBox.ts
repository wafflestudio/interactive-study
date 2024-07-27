import { gsap } from 'gsap';
import * as THREE from 'three';
import { object } from 'zod';

import { KeyMap } from '../../../libs/keyboard/KeyMap';
import {
  EventCallback,
  ListenableRaycaster,
} from '../../../libs/raycaster/Raycaster';
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
    renderer: THREE.WebGLRenderer,
  ): Scenario =>
  (set) => {
    const spinBoxRaycaster = new ListenableRaycaster(
      sceneManager.currentCamera,
      sceneManager.currentScene,
      renderer,
    );
    return [
      {
        name: 'spinbox_01', // 오프닝
        onMount: () => {
          dialogue.begin(['박스 찾으러 가세요'], () => {
            set('spinbox_02');
          });
        },
      },
      {
        name: 'spinbox_02', // 캐릭터가 박스를 찾으러 다니는 씬
        onMount: () => {
          console.log('spinbox_02');
          // 02에서 03으로 넘어가는 로직은 Packages.ts에 있음
        },
      },
      {
        name: 'spinbox_03', // 박스로 카메라 이동
        onMount: () => {
          // hide player
          const playerInfo = cannonManager.totalObjectMap.get('Scene');
          playerInfo!.isMovable = false;
          sceneManager.currentScene.remove(playerInfo!.mesh);

          // camera animation
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

          dialogue.begin(['박스를 찾았다!', '이걸로 뭐하지'], () => {
            set('spinbox_04');
          });
        },
      },
      {
        name: 'spinbox_04', // 박스 클로즈업 씬, raycaster로 박스 돌리기
        onMount: () => {
          // raycaster
          const targetObjects = [
            cannonManager.totalObjectMap.get('큐브002')!.mesh,
            cannonManager.totalObjectMap.get('큐브003')!.mesh,
            cannonManager.totalObjectMap.get('큐브004')!.mesh,
            cannonManager.totalObjectMap.get('큐브007')!.mesh,
            cannonManager.totalObjectMap.get('큐브008')!.mesh,
            cannonManager.totalObjectMap.get('큐브009')!.mesh,
          ];

          function pivotOnWorldAxis(
            object: THREE.Object3D,
            center: THREE.Vector3,
            axis: THREE.Vector3,
            angle: number,
          ): void {
            const parent = object.parent;

            if (parent === null) {
              console.error("object can't be found in the world");
            } else {
              const radianAngle = THREE.MathUtils.degToRad(angle);

              // rotate object on world axis
              object.rotateOnWorldAxis(axis, radianAngle);

              // rotate object position around center
              parent.worldToLocal(
                parent
                  .localToWorld(object.position)
                  .sub(center)
                  .applyAxisAngle(axis, radianAngle)
                  .add(center),
              );
            }
          }
          const clickCallback: EventCallback = (
            intersects: THREE.Intersection[],
          ) => {
            if (intersects.length > 0) {
              const selectedObject = intersects[0].object;
              const objectInfo = cannonManager.totalObjectMap.get(
                selectedObject.name,
              );
              const objectCenter = objectInfo!.boxCenter; // 현재 세계에서 박스 위치와 정확히 일치하는 중심

              pivotOnWorldAxis(
                selectedObject,
                objectCenter,
                new THREE.Vector3(1, 1, 1).normalize(),
                180,
              );
            }
          };
          spinBoxRaycaster.registerCallback(
            'click',
            clickCallback,
            targetObjects,
          );
        },
      },
    ];
  };
