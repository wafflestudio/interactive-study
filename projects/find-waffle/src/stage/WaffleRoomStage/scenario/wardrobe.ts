import { Dialogue } from '../core/dialogue/Dialogue';
import { Scenario } from '../core/scenario/ScenarioManager';
import { SceneManager } from '../core/scene/SceneManager';

export const wardrobeScenario =
  (sceneManager: SceneManager, dialogue: Dialogue): Scenario =>
  (set) => [
    {
      name: 'wardrobe_01',
      onMount: () => {},
    },
    {
      name: 'wardrobe_02',
      onMount: () => {
        dialogue.begin(
          [
            [
              {
                value: '역시 예상이 맞았어\n이제 두 개 남았다!',
              },
            ],
          ],
          () => {
            set('spinbox_01');
          },
        );
      },
    },
  ];
