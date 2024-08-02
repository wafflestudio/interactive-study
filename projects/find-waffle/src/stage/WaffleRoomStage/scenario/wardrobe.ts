import { Dialogue } from '../core/dialogue/Dialogue';
import { Scenario } from '../core/scenario/ScenarioManager';
import { SceneManager } from '../core/scene/SceneManager';

export const wardrobeScenario =
  (sceneManager: SceneManager, dialogue: Dialogue): Scenario =>
  () => [
    {
      name: 'wardrobe_01',
      onMount: () => {
        dialogue.begin(
          [
            [
              {
                value: `옷장을 열어보니 와플이 숨어있는 것 같아!`,
                size: 'normal',
              },
            ],
            [
              {
                value: `어디에 숨어있을까?`,
                size: 'normal',
              },
            ],
          ],
          () => {},
        );
      },
    },
  ];
