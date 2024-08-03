import * as CANNON from 'cannon-es';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { object } from 'zod';

import { StageManager } from '../../../core/stage/StageManager';
import { KeyMap } from '../../../libs/keyboard/KeyMap';
import { CannonManager } from '../core/cannon/CannonManager';
import { Dialogue } from '../core/dialogue/Dialogue';
import { Scenario, ScenarioManager } from '../core/scenario/ScenarioManager';
import { SceneManager } from '../core/scene/SceneManager';
import { Player } from '../object/Player';

export const spinTileScenario =
  (
    scenarioManager: ScenarioManager,
    sceneManager: SceneManager,
    cannonManager: CannonManager,
    keyMap: KeyMap,
    dialogue: Dialogue,
    renderer: THREE.WebGLRenderer,
    playerObject: Player,
  ): Scenario =>
  (set) => {
    const stageManager = StageManager.instance;
    console.log(stageManager);
    const tileMap: Map<string, string> = new Map();
    return [
      {
        name: 'spintile_01', // 오프닝
        onMount: () => {
          console.log(keyMap);
          const playerInfo = cannonManager.totalObjectMap.get('Scene');
          playerInfo!.mesh.position.set(10, 0, 10);
          sceneManager.currentScene.add(playerInfo!.mesh);
          playerInfo!.isMovable = true;

          dialogue.begin(
            [
              [{ value: '이제 마지막 와플만이 남았네' }],
              [
                {
                  value: '뒤질 만한 곳은 다 찾아본 것 같은데......\n',
                  size: 'normal',
                },
                { value: '어!?', size: 'large' },
              ],
              [
                {
                  value: '바닥의 글자 배치가 좀 이상한데?\n한번 잘 돌려볼까??',
                  size: 'normal',
                },
              ],
              [
                {
                  value:
                    '원하는 곳을 바라보고 T키를 누르면 타일을 돌릴 수 있어',
                  size: 'normal',
                },
              ],
            ],
            () => {
              set('spintile_02');
            },
          );
        },
      },
      {
        name: 'spintile_02', // 캐릭터가 타일을 돌려보는 씬
        onMount: () => {
          console.log(keyMap);
          for (let i = 1; i < 9; i++) {
            for (let j = 1; j < 9; j++) {
              const tileName = `tile_${i}${j}`;
              const textName = `letter_${i}${j}`;
              tileMap.set(tileName, textName);
            }
          }
          tileMap.forEach((textName, tileName) => {
            const tile = cannonManager.totalObjectMap.get(tileName);
            tile!.mesh.userData.spinCount = 0;
          });

          const tile_w = cannonManager.totalObjectMap.get('tile_75');
          const tile_a = cannonManager.totalObjectMap.get('tile_65');
          const tile_f1 = cannonManager.totalObjectMap.get('tile_55');
          const tile_f2 = cannonManager.totalObjectMap.get('tile_45');
          const tile_l = cannonManager.totalObjectMap.get('tile_35');
          const tile_e = cannonManager.totalObjectMap.get('tile_25');

          let isAnimating = false;

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

          const currentAngle = { angle: 0 };
          const tilePosition = { y: 0 };

          const player = cannonManager.totalObjectMap.get('Scene');

          keyMap.bind('t', () => {
            playerObject.changeAction('action');

            // Euler 각도로 변환하여 범위로 상하좌우 계산
            const quaternion = player!.body.quaternion;
            const euler = new CANNON.Vec3();
            quaternion.toEuler(euler, 'YZX');
            const yaw = euler.y * (180 / Math.PI);

            let playerDirection = 1;
            const errorRange = 30;

            const downCase = yaw >= -errorRange && yaw <= errorRange;
            const upCase = yaw >= 180 - errorRange || yaw <= -180 + errorRange; // 180도와 -180도 사이의 오차 허용
            const rightCase = yaw >= 90 - errorRange && yaw <= 90 + errorRange;
            const leftCase = yaw >= -90 - errorRange && yaw <= -90 + errorRange;

            // 방향 판단을 위한 조건문
            if (upCase) {
              playerDirection = 0; // up
            } else if (downCase) {
              playerDirection = 1; // down
            } else if (rightCase) {
              playerDirection = 2; // right
            } else if (leftCase) {
              playerDirection = 3; // left
            } else {
              playerDirection = 4;
            }

            if (isAnimating) return;

            const currentPosition = player!.body.position;
            tileMap.forEach((textName, tileName) => {
              const tile = cannonManager.totalObjectMap.get(tileName);
              const halfExtents = tile?.body.shapes[0].halfExtents;
              const constraint = 0.3;

              if (
                currentPosition.x <=
                  tile!.boxCenter.x + halfExtents.x - constraint &&
                currentPosition.x >=
                  tile!.boxCenter.x - halfExtents.x + constraint &&
                currentPosition.z <=
                  tile!.boxCenter.z + halfExtents.z - constraint &&
                currentPosition.z >=
                  tile!.boxCenter.z - halfExtents.z + constraint
              ) {
                const rowNum = Number(tileName.split('_')[1][0]);
                const colNum = Number(tileName.split('_')[1][1]);
                let targetTileName = '';
                let targetTextName = '';
                switch (playerDirection) {
                  case 0:
                    targetTileName = `tile_${rowNum - 1}${colNum}`;
                    targetTextName = `letter_${rowNum - 1}${colNum}`;
                    break;
                  case 1:
                    targetTileName = `tile_${rowNum + 1}${colNum}`;
                    targetTextName = `letter_${rowNum + 1}${colNum}`;
                    break;
                  case 2:
                    targetTileName = `tile_${rowNum}${colNum + 1}`;
                    targetTextName = `letter_${rowNum}${colNum + 1}`;
                    break;
                  case 3:
                    targetTileName = `tile_${rowNum}${colNum - 1}`;
                    targetTextName = `letter_${rowNum}${colNum - 1}`;
                    break;
                }
                const targetTile =
                  cannonManager.totalObjectMap.get(targetTileName);
                const targetText =
                  cannonManager.totalObjectMap.get(targetTextName);
                const targetTileParent = targetTile!.mesh.parent;
                const targetTextParent = targetText!.mesh.parent;
                const targetTileWorldPos = targetTile!.mesh.getWorldPosition(
                  new THREE.Vector3(),
                );
                const targetTextWorldPos = targetText!.mesh.getWorldPosition(
                  new THREE.Vector3(),
                );

                isAnimating = true;
                gsap.to(tilePosition, {
                  duration: 1,
                  y: 2,
                  ease: 'power2.inOut',
                  onUpdate: () => {
                    // 타일 들어올리기
                    sceneManager.currentScene.attach(targetTile!.mesh);
                    sceneManager.currentScene.attach(targetText!.mesh);
                    targetTile!.mesh.position.y =
                      targetTileWorldPos.y + tilePosition.y;
                    targetText!.mesh.position.y =
                      targetTextWorldPos.y + tilePosition.y;
                  },
                  onComplete: () => {
                    gsap.to(currentAngle, {
                      duration: 1,
                      angle: 90,
                      ease: 'power2.inOut',
                      onUpdate: () => {
                        // 타일 돌리기
                        const deltaAngle =
                          currentAngle.angle -
                          targetTile!.mesh.userData.lastAngle;
                        pivotOnWorldAxis(
                          targetTile!.mesh,
                          targetTile!.boxCenter,
                          new THREE.Vector3(0, 1, 0).normalize(),
                          deltaAngle,
                        );
                        pivotOnWorldAxis(
                          targetText!.mesh,
                          targetText!.boxCenter,
                          new THREE.Vector3(0, 1, 0).normalize(),
                          deltaAngle,
                        );
                        targetTile!.mesh.userData.lastAngle =
                          currentAngle.angle;
                      },
                      onStart: () => {
                        targetTile!.mesh.userData.lastAngle = 0;
                      },
                      onComplete: () => {
                        currentAngle.angle = 0;
                        gsap.to(tilePosition, {
                          duration: 1,
                          y: 0,
                          ease: 'power2.inOut',
                          onUpdate: () => {
                            // 타일 내리기
                            targetTile!.mesh.position.y =
                              targetTileWorldPos.y + tilePosition.y;
                            targetText!.mesh.position.y =
                              targetTextWorldPos.y + tilePosition.y;
                          },
                          onComplete: () => {
                            targetTileParent!.attach(targetTile!.mesh);
                            targetTextParent!.attach(targetText!.mesh);
                            isAnimating = false;
                            targetTile!.mesh.userData.spinCount += 1;
                            console.log(targetTile!.mesh.userData.spinCount);

                            if (
                              tile_w!.mesh.userData.spinCount % 4 === 2 &&
                              tile_a!.mesh.userData.spinCount % 4 === 3 &&
                              tile_f1!.mesh.userData.spinCount % 4 === 2 &&
                              tile_f2!.mesh.userData.spinCount % 4 === 2 &&
                              tile_l!.mesh.userData.spinCount % 4 === 3 &&
                              tile_e!.mesh.userData.spinCount % 4 === 1
                            ) {
                              console.log('done');
                              set('spintile_03');
                            }
                          },
                        });
                      },
                    });
                  },
                });
              }
            });
          });
        },
      },
      {
        name: 'spintile_03',
        onMount: () => {
          // const cameraPosition = { x: 100, y: 80, z: 100 };
          // gsap.to(cameraPosition, {
          //   duration: 2,
          //   x: 10,
          //   y: 50,
          //   z: 10,

          //   ease: 'power2.inOut',
          //   onUpdate: () => {
          //     console.log(sceneManager.roomCamera.position);
          //     sceneManager.roomCamera.position.set(
          //       cameraPosition.x,
          //       cameraPosition.y,
          //       cameraPosition.z,
          //     );
          //     sceneManager.roomCamera.updateProjectionMatrix();
          //   },
          // });
          // const lookAtPoint = { x: 0, y: 0, z: 0 };
          // gsap.to(lookAtPoint, {
          //   duration: 2,
          //   x: 10,
          //   y: 0,
          //   z: 10,
          //   ease: 'power2.inOut',
          //   onUpdate: () => {
          //     sceneManager.roomCamera.lookAt(
          //       lookAtPoint.x,
          //       lookAtPoint.y,
          //       lookAtPoint.z,
          //     );
          //     sceneManager.roomCamera.updateProjectionMatrix();
          //   },
          // });
          // sceneManager.roomCamera.position.set(10, 50, 10);
          // sceneManager.roomCamera.lookAt(10, 0, 10);

          dialogue.begin(
            [
              [{ value: '이얏호! 와플 세 개를 다 찾았다' }],
              [{ value: '이제 다음 맵을 클리어하러 떠나야겠어.\n🧇🧇🧇' }],
            ],
            () => {
              stageManager.toHome();
            },
          );
        },
      },
      {
        name: 'spintile_04',
        onMount: () => {},
      },
    ];
  };
