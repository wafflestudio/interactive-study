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
          const player = cannonManager.totalObjectMap.get('Scene');
          console.log(player);

          tileNames.forEach((tileName) => {
            const tile = cannonManager.totalObjectMap.get(tileName);
            cannonManager.filterCollision(tile?.body!, 2, 1);
          });

          keyMap.bind('h', () => {
            console.log('h');
            const currentPosition = player!.body.position;
            tileNames.forEach((tileName) => {
              const tile = cannonManager.totalObjectMap.get(tileName);
              const halfExtents = tile?.body.shapes[0].halfExtents;
              if (
                currentPosition.x <= tile.boxCenter.x + halfExtents.x &&
                currentPosition.x >= tile.boxCenter.x - halfExtents.x &&
                currentPosition.z <= tile.boxCenter.z + halfExtents.z &&
                currentPosition.z >= tile.boxCenter.z - halfExtents.z
              ) {
                gsap.to(tile?.mesh.position!, {
                  duration: 2,
                  y: 3,
                  ease: 'power2.inOut',
                  onComplete: () => {
                    gsap.to(tile?.mesh.quaternion!, {
                      duration: 2,
                      y: Math.PI / 2,
                      ease: 'power2.inOut',
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

const tileNames = [
  '큐브098',
  '큐브030',
  '큐브038',
  '큐브046',
  '큐브054',
  '큐브062',
  '큐브070',
  '큐브020',
  '큐브028',
  '큐브031',
  '큐브039',
  '큐브047',
  '큐브055',
  '큐브063',
  '큐브071',
  '큐브018',
];
