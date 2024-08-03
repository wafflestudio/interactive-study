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
import { ScenarioManager } from '../core/scenario/ScenarioManager';
import { SceneManager } from '../core/scene/SceneManager';

export const spinboxScenario =
  (
    scenarioManager: ScenarioManager,
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
    const spinBoxRaycaster2 = new ListenableRaycaster(
      sceneManager.currentCamera,
      sceneManager.currentScene,
      renderer,
    );
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
    return [
      {
        name: 'spinbox_01', // 오프닝
        onMount: () => {
          dialogue.begin(
            [
              [
                {
                  value:
                    '흐음... 저기 박스 더미가 의심스러운데?\n당장 열어봐야겠어',
                },
              ],
            ],
            () => {
              set('spinbox_02');
            },
          );
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

          dialogue.begin(
            [
              [{ value: '오잉!?!?', size: 'huge' }],
              [
                { value: '이것들, ', size: 'normal' },
                { value: '박스', size: 'large' },
                { value: '가 아니라 ', size: 'normal' },
                { value: '사각형 조각', size: 'large' },
                { value: '이잖아!?', size: 'normal' },
              ],
              [
                {
                  value: '박스 조각들로 와플을 만들어 볼까?',
                  size: 'normal',
                },
              ],
            ],
            () => {
              set('spinbox_04');
            },
          );
        },
      },
      {
        name: 'spinbox_04', // 박스 클로즈업 씬, raycaster로 박스 돌리기
        onMount: () => {
          let isAnimating = false;

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
            object.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material.depthTest = false;
                child.renderOrder = 2;
              }
            });
          });

          const clickCallback: EventCallback = (
            intersects: THREE.Intersection[],
          ) => {
            if (isAnimating) return;
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
                  isAnimating = true;
                  targetObject.userData.lastAngle = 0;
                },
                onComplete: () => {
                  isAnimating = false;
                  targetObject.userData.clicked = true;
                  if (
                    targetObjects.every((object) => object.userData.clicked)
                  ) {
                    targetObjects.forEach((obj) => {
                      obj.userData.isDraggable = true;
                    });
                    spinBoxRaycaster.dispose();
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
          // 카메라 줌아웃
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
            onComplete: () => {
              dialogue.begin(
                [
                  [
                    {
                      value: '어, 그러고 보니 액자가 텅 비어있네?!\n채워볼까?',
                    },
                  ],
                ],
                () => {},
              );
            },
          });

          // Drag 이벤트 구현
          let dragging = false;
          let selectedObject: THREE.Object3D | null = null;
          let offset = new THREE.Vector3();

          const box1 = cannonManager.totalObjectMap.get('box1')!.mesh;
          const box2 = cannonManager.totalObjectMap.get('box2')!.mesh;
          const box3 = cannonManager.totalObjectMap.get('box3')!.mesh;
          const box4 = cannonManager.totalObjectMap.get('box4')!.mesh;
          const box5 = cannonManager.totalObjectMap.get('box5')!.mesh;
          const box6 = cannonManager.totalObjectMap.get('box6')!.mesh;

          const frame = cannonManager.totalObjectMap.get('평면')!.mesh;

          const piece1 = box1.children[0];
          const piece2 = box1.children[1];
          const piece3 = box2.children[1];
          const piece4 = box3.children[0];
          const piece5 = box4.children[1];
          const piece6 = box6.children[0];

          const targetObjects = [
            frame,
            piece1,
            piece2,
            piece3,
            piece4,
            piece5,
            piece6,
          ];

          sceneManager.currentScene.attach(box5.children[1]);
          sceneManager.currentScene.attach(box5.children[0]);
          sceneManager.currentScene.attach(box4.children[1]);
          sceneManager.currentScene.attach(box4.children[0]);
          sceneManager.currentScene.attach(box6.children[1]);
          sceneManager.currentScene.attach(box6.children[0]);

          const piece7 = box4;
          const piece8 = box5;
          const piece9 = box6;

          targetObjects.push(piece7);
          targetObjects.push(piece8);
          targetObjects.push(piece9);

          const pieceMap = new Map([
            [
              piece1, // 00
              {
                color: '#221117',
                position: new THREE.Vector3(0.5, 15, 16),
                quaternionAxis: new THREE.Vector3(0, 0, 1).normalize(),
                attached: false,
              },
            ],
            [
              piece2, // 11
              {
                color: '#f1985d',
                position: new THREE.Vector3(0.5, 12, 13.1),
                quaternionAxis: new THREE.Vector3(0, 0, 1).normalize(),
                attached: false,
              },
            ],
            [
              piece3, // 12
              {
                color: '#f1985d',
                position: new THREE.Vector3(0.5, 12, 10.2),
                quaternionAxis: new THREE.Vector3(0, 0, 1).normalize(),
                attached: false,
              },
            ],
            [
              piece4, // 01
              {
                color: '#221117',
                position: new THREE.Vector3(0.5, 15, 13.1),
                quaternionAxis: new THREE.Vector3(0, 0, 1).normalize(),
                attached: false,
              },
            ],
            [
              piece5, // 21
              {
                color: '#f1985d',
                position: new THREE.Vector3(0.5, 9, 13.1),
                quaternionAxis: new THREE.Vector3(0, 0, 1).normalize(),
                attached: false,
              },
            ],
            [
              piece6, // 02
              {
                color: '#221117',
                position: new THREE.Vector3(0.5, 15, 10.2),
                quaternionAxis: new THREE.Vector3(0, 0, 1).normalize(),
                attached: false,
              },
            ],
            [
              piece7, // 10
              {
                color: '#221117',
                position: new THREE.Vector3(0.5, 12, 16),
                quaternionAxis: new THREE.Vector3(0, 0, 1).normalize(),
                attached: false,
              },
            ],
            [
              piece8, // 20
              {
                color: '#221117',
                position: new THREE.Vector3(0.5, 9, 16),
                quaternionAxis: new THREE.Vector3(0, 0, 1).normalize(),
                attached: false,
              },
            ],
            [
              piece9, // 22
              {
                color: '#ee8674',
                position: new THREE.Vector3(0.5, 9, 10.2),
                quaternionAxis: new THREE.Vector3(0, 0, 1).normalize(),
                attached: false,
              },
            ],
          ]);

          const mouseMoveCallbackForDrag: EventCallback = (
            intersects: THREE.Intersection[],
          ) => {
            if (dragging && selectedObject) {
              if (intersects.length > 0) {
                const intersect = intersects[0];
                const newPosition = new THREE.Vector3().copy(intersect.point);
                sceneManager.currentScene.attach(selectedObject);
                selectedObject.position.x = newPosition.x;
                selectedObject.position.y = newPosition.y;
                selectedObject.position.z = newPosition.z;
              }
            }
          };

          const mouseDownCallback: EventCallback = (
            intersects: THREE.Intersection[],
          ) => {
            if (intersects.length > 0 && intersects[0].object != frame) {
              pieceMap.forEach((value, key) => {
                if (intersects[0].object === key && !value.attached) {
                  selectedObject = intersects[0].object;
                  dragging = true;
                  offset
                    .copy(selectedObject!.position)
                    .sub(intersects[0].point);
                }
              });
              // selectedObject = intersects[0].object;
              // dragging = true;
              // offset.copy(selectedObject!.position).sub(intersects[0].point);
            }
          };

          const mouseUpCallback: EventCallback = (
            intersects: THREE.Intersection[],
          ) => {
            dragging = false;

            if (!selectedObject) return;
            pieceMap.forEach((value, key) => {
              if (selectedObject === key) {
                selectedObject!.quaternion.setFromAxisAngle(
                  value.quaternionAxis,
                  -Math.PI / 2,
                );
              }
            });

            if (intersects.length > 0) {
              intersects.forEach((intersect) => {
                if (frame === intersect.object) {
                  pieceMap.forEach((value, key) => {
                    if (selectedObject === key) {
                      (selectedObject as THREE.Mesh).material =
                        new THREE.MeshStandardMaterial({
                          depthTest: false,
                          color: new THREE.Color(value.color),
                        });
                      selectedObject.position.set(
                        value.position.x,
                        value.position.y,
                        value.position.z,
                      );
                      value.attached = true;
                    }
                  });
                  // attached가 모두 true이면 클리어
                  if (
                    Array.from(pieceMap.values()).every(
                      (value) => value.attached,
                    )
                  ) {
                    set('spinbox_06');
                  }
                }
              });
            }
            selectedObject = null;
          };

          spinBoxRaycaster2.registerCallback(
            'mousemove',
            mouseMoveCallbackForDrag,
            targetObjects,
          );
          spinBoxRaycaster2.registerCallback(
            'mousedown',
            mouseDownCallback,
            targetObjects,
          );
          spinBoxRaycaster2.registerCallback(
            'mouseup',
            mouseUpCallback,
            targetObjects,
          );
        },
      },
      {
        name: 'spinbox_06', // 클리어
        onMount: () => {
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
            object.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material.depthTest = true;
              }
            });
          });

          const frustumSize = { frustumSize: 30 };
          gsap.to(frustumSize, {
            duration: 3,
            frustumSize: 50,
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
          dialogue.begin(
            [[{ value: '이얏호!!! 와플 액자를 만들었따!' }]],
            () => {
              scenarioManager.set('spintile_01');
            },
          );
          // const position = {
          //   x: sceneManager.roomCamera.position.x,
          //   y: sceneManager.roomCamera.position.y,
          //   z: sceneManager.roomCamera.position.z,
          // };
          // gsap.to(position, {
          //   duration: 1,
          //   x: 100,
          //   y: 11,
          //   z: 11,
          //   onUpdate: () => {
          //     sceneManager.roomCamera.position.set(
          //       position.x,
          //       position.y,
          //       position.z,
          //     );
          //   },
          //   onComplete: () => {
          //     const lookAtPoint = { x: 100, y: 69, z: 89 };
          //     gsap.to(lookAtPoint, {
          //       duration: 2,
          //       x: 0,
          //       y: 11,
          //       z: 11,
          //       ease: 'power2.inOut',
          //       onUpdate: () => {
          //         sceneManager.roomCamera.lookAt(
          //           lookAtPoint.x,
          //           lookAtPoint.y,
          //           lookAtPoint.z,
          //         );
          //       },
          //       onComplete: () => {
          //         const frustumSize = { frustumSize: 30 };
          //         gsap.to(frustumSize, {
          //           duration: 1,
          //           frustumSize: 12,
          //           ease: 'power2.inOut',
          //           onUpdate: () => {
          //             sceneManager.roomCamera.left =
          //               (-frustumSize.frustumSize * sceneManager.aspectRatio) /
          //               2;
          //             sceneManager.roomCamera.right =
          //               (frustumSize.frustumSize * sceneManager.aspectRatio) /
          //               2;
          //             sceneManager.roomCamera.top = frustumSize.frustumSize / 2;
          //             sceneManager.roomCamera.bottom =
          //               -frustumSize.frustumSize / 2;
          //             sceneManager.roomCamera.updateProjectionMatrix();
          //           },
          //           onComplete: () => {
          //             dialogue.begin(
          //               [[{ value: '이얏호!!! 와플 액자를 만들었따!' }]],
          //               () => {
          //                 set('spintile_01');
          //               },
          //             );
          //           },
          //         });
          //       },
          //     });
          //   },
          // });
        },
      },
    ];
  };
