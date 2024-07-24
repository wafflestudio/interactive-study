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
      // 예시 코드
      name: 'spinbox_01',
      onMount: () => {
        console.log(sceneManager.currentCamera);
        set('spinbox_02');
      },
    },
    { name: 'spinbox_02' },
  ];
