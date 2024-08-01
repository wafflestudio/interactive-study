import * as CANNON from 'cannon-es';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { object } from 'zod';

import { KeyMap } from '../../../libs/keyboard/KeyMap';
import { CannonManager } from '../core/cannon/CannonManager';
import { Dialogue } from '../core/dialogue/Dialogue';
import { Scenario } from '../core/scenario/ScenarioManager';
import { SceneManager } from '../core/scene/SceneManager';

export const spinTileScenario =
  (
    sceneManager: SceneManager,
    cannonManager: CannonManager,
    keyMap: KeyMap,
    dialogue: Dialogue,
    renderer: THREE.WebGLRenderer,
  ): Scenario =>
  (set) => {
    const tileMap: Map<string, string> = new Map();
    return [
      {
        name: 'spintile_01', // 오프닝
        onMount: () => {
          dialogue.begin(['타일 돌려보세요'], () => {
            set('spintile_02');
          });
        },
      },
      {
        name: 'spintile_02', // 캐릭터가 타일을 돌려보는 씬
        onMount: () => {
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

          keyMap.bind('h', () => {
            // Euler 각도로 변환하여 범위로 상하좌우 계산
            const quaternion = player!.body.quaternion;
            const euler = new CANNON.Vec3();
            quaternion.toEuler(euler, 'YZX');
            const yaw = euler.y * (180 / Math.PI);

            let playerDirection = 1;
            const errorRange = 20;

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

              if (
                currentPosition.x <= tile!.boxCenter.x + halfExtents.x &&
                currentPosition.x >= tile!.boxCenter.x - halfExtents.x &&
                currentPosition.z <= tile!.boxCenter.z + halfExtents.z &&
                currentPosition.z >= tile!.boxCenter.z - halfExtents.z
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
          dialogue.begin(['와플을 찾았습니다!'], () => {});
        },
      },
      {
        name: 'spintile_04',
        onMount: () => {},
      },
    ];
  };
