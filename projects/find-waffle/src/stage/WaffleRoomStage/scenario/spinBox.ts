import { gsap } from 'gsap';
import * as THREE from 'three';

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

          const frustumSize = { frustumSize: sceneManager.frustumSize };
          gsap.to(frustumSize, {
            duration: 3,
            frustumSize: 15,
            ease: 'power2.inOut',
            onUpdate: () => {
              sceneManager.roomCamera.left =
                (-frustumSize.frustumSize * sceneManager.aspectRatio) / 2;
              sceneManager.roomCamera.right =
                (frustumSize.frustumSize * sceneManager.aspectRatio) / 2;
              sceneManager.roomCamera.top = frustumSize.frustumSize / 2;
              sceneManager.roomCamera.bottom = -frustumSize.frustumSize / 2;
              sceneManager.roomCamera.updateProjectionMatrix();
            },
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
            cannonManager.totalObjectMap.get('box1')!.mesh,
            cannonManager.totalObjectMap.get('box2')!.mesh,
            cannonManager.totalObjectMap.get('box3')!.mesh,
            cannonManager.totalObjectMap.get('box4')!.mesh,
            cannonManager.totalObjectMap.get('box5')!.mesh,
            cannonManager.totalObjectMap.get('box6')!.mesh,
          ];

          targetObjects.forEach((object) => {
            object.userData.clicked = false;
          });

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
              let targetObject = selectedObject;
              if (
                selectedObject.name === 'box_sample_left' ||
                selectedObject.name === 'box_sample_right'
              ) {
                targetObject = selectedObject.parent!;
              }

              const objectInfo = cannonManager.totalObjectMap.get(
                targetObject.name,
              );
              const objectCenter = objectInfo!.boxCenter; // 현재 세계에서 박스 위치와 정확히 일치하는 중심

              const currentAngle = { angle: 0 };

              gsap.to(currentAngle, {
                duration: 1,
                angle: 180,
                ease: 'power1.inOut',
                onUpdate: () => {
                  if (!targetObject.userData.clicked) {
                    const deltaAngle =
                      currentAngle.angle - targetObject.userData.lastAngle;
                    pivotOnWorldAxis(
                      targetObject,
                      objectCenter,
                      new THREE.Vector3(1, 1, 1).normalize(),
                      deltaAngle,
                    );
                    targetObject.userData.lastAngle = currentAngle.angle;
                  }
                },
                onStart: () => {
                  targetObject.userData.lastAngle = 0;
                },
                onComplete: () => {
                  targetObject.userData.clicked = true;
                  if (
                    targetObjects.every((object) => object.userData.clicked)
                  ) {
                    targetObjects.forEach((obj) => {
                      obj.userData.isDraggable = true;
                    });
                    set('spinbox_05');
                  }
                },
              });
            }
          };
          spinBoxRaycaster.registerCallback(
            'click',
            clickCallback,
            targetObjects,
          );
        },
      },
      {
        name: 'spinbox_05', // 박스 조각을 액자로 드래그
        onMount: () => {
          // spinBoxRaycaster.dispose();
          const frustumSize = { frustumSize: 15 };
          gsap.to(frustumSize, {
            duration: 3,
            frustumSize: 30,
            ease: 'power2.inOut',
            onUpdate: () => {
              sceneManager.roomCamera.left =
                (-frustumSize.frustumSize * sceneManager.aspectRatio) / 2;
              sceneManager.roomCamera.right =
                (frustumSize.frustumSize * sceneManager.aspectRatio) / 2;
              sceneManager.roomCamera.top = frustumSize.frustumSize / 2;
              sceneManager.roomCamera.bottom = -frustumSize.frustumSize / 2;
              sceneManager.roomCamera.updateProjectionMatrix();
            },
          });

          // Drag 이벤트 구현
          let dragging = false;
          let selectedObject: THREE.Object3D | null = null;
          let offset = new THREE.Vector3();

          const mouseMoveCallbackForDrag: EventCallback = (
            intersects: THREE.Intersection[],
          ) => {
            if (dragging && selectedObject) {
              if (intersects.length > 0) {
                const intersect = intersects[0];
                const newPosition = new THREE.Vector3().copy(intersect.point);
                sceneManager.currentScene.attach(selectedObject);
                console.log(newPosition);
                selectedObject.position.x = newPosition.x;
                selectedObject.position.y = newPosition.y;
                selectedObject.position.z = newPosition.z;
              }
            }
          };

          const mouseDownCallback: EventCallback = (
            intersects: THREE.Intersection[],
          ) => {
            if (intersects.length > 0) {
              selectedObject = intersects[0].object;
              dragging = true;
              offset.copy(selectedObject!.position).sub(intersects[0].point);
            }
          };

          const mouseUpCallback: EventCallback = () => {
            dragging = false;
            selectedObject = null;
          };

          const targetObjects = [
            ...cannonManager.totalObjectMap.get('box1')!.mesh.children,
            ...cannonManager.totalObjectMap.get('box2')!.mesh.children,
            ...cannonManager.totalObjectMap.get('box3')!.mesh.children,
            ...cannonManager.totalObjectMap.get('box4')!.mesh.children,
            ...cannonManager.totalObjectMap.get('box5')!.mesh.children,
            ...cannonManager.totalObjectMap.get('box6')!.mesh.children,
          ];

          targetObjects.forEach((obj) => {
            console.log(obj);
          });

          spinBoxRaycaster.registerCallback(
            'mousemove',
            mouseMoveCallbackForDrag,
            targetObjects,
          );
          spinBoxRaycaster.registerCallback(
            'mousedown',
            mouseDownCallback,
            targetObjects,
          );
          spinBoxRaycaster.registerCallback(
            'mouseup',
            mouseUpCallback,
            targetObjects,
          );
        },
      },
    ];
  };
