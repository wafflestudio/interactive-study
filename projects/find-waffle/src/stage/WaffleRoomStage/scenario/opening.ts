import { Dialogue } from '../core/dialogue/Dialogue';
import { Scenario } from '../core/scenario/ScenarioManager';
import { SceneManager } from '../core/scene/SceneManager';

export const openingScenario =
  (sceneManager: SceneManager, dialogue: Dialogue): Scenario =>
  (set) => [
    {
      name: 'opening_01',
      onMount: () => {
        dialogue.begin(['opening_01입니다'], () => {
          set('opening_02');
        });
      },
    },
    {
      name: 'opening_02',
      onMount: () => {
        dialogue.begin(['opening_02입니다'], () => {});
      },
    },
  ];
