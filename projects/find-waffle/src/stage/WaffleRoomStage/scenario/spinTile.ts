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
          console.log(player);

          keyMap.bind('h', () => {
            console.log('h');
            const currentPosition = player!.body.position;
            console.log(tileMap.keys());
            tileMap.forEach((textName, tileName) => {
              const tile = cannonManager.totalObjectMap.get(tileName);
              const text = cannonManager.totalObjectMap.get(textName);
              const halfExtents = tile?.body.shapes[0].halfExtents;

              if (
                currentPosition.x <= tile!.boxCenter.x + halfExtents.x &&
                currentPosition.x >= tile!.boxCenter.x - halfExtents.x &&
                currentPosition.z <= tile!.boxCenter.z + halfExtents.z &&
                currentPosition.z >= tile!.boxCenter.z - halfExtents.z
              ) {
                gsap.to(tilePosition, {
                  duration: 1,
                  y: 3,
                  ease: 'power2.inOut',
                  onUpdate: () => {
                    tile!.mesh.position.y = tilePosition.y;
                    text!.mesh.position.y = tilePosition.y;
                  },
                  onComplete: () => {
                    gsap.to(currentAngle, {
                      duration: 1,
                      angle: 90,
                      ease: 'power2.inOut',
                      onUpdate: () => {
                        const deltaAngle =
                          currentAngle.angle - tile!.mesh.userData.lastAngle;
                        pivotOnWorldAxis(
                          tile!.mesh,
                          tile!.boxCenter,
                          new THREE.Vector3(0, 1, 0).normalize(),
                          deltaAngle,
                        );
                        pivotOnWorldAxis(
                          text!.mesh,
                          text!.boxCenter,
                          new THREE.Vector3(0, 1, 0).normalize(),
                          deltaAngle,
                        );
                        tile!.mesh.userData.lastAngle = currentAngle.angle;
                      },
                      onStart: () => {
                        tile!.mesh.userData.lastAngle = 0;
                      },
                      onComplete: () => {
                        currentAngle.angle = 0;
                        gsap.to(tilePosition, {
                          duration: 1,
                          y: 0,
                          ease: 'power2.inOut',
                          onUpdate: () => {
                            tile!.mesh.position.y = tilePosition.y;
                            text!.mesh.position.y = tilePosition.y;
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
        onMount: () => {},
      },
      {
        name: 'spintile_04',
        onMount: () => {},
      },
    ];
  };

const tileMap: Map<string, string> = new Map([
  ['큐브098', '텍스트022'],
  ['큐브030', '텍스트038'],
]);
