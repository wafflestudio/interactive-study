import { Dialogue } from '../core/dialogue/Dialogue';
import { Scenario } from '../core/scenario/ScenarioManager';
import { SceneManager } from '../core/scene/SceneManager';

export const openingScenario =
  (sceneManager: SceneManager, dialogue: Dialogue): Scenario =>
  (set) => [
    {
      name: 'opening_01',
      onMount: () => {
        dialogue.begin(
          [
            [{ value: `이 방 안에 3개의 와플이 숨어있다고?!` }],
            [
              {
                value: `음... 일단 보물찾기의 기본 중 기본! \n옷장부터 뒤져 볼까?`,
              },
            ],
          ],
          () => {},
        );
      },
    },
    // {
    //   name: 'opening_02',
    //   onMount: () => {
    //     dialogue.begin([[{ value: 'opening_02입니다' }]], () => {});
    //   },
    // },
    // {
    //   name: 'opening_03',
    //   onMount: () => {
    //     dialogue.begin([
    //       [
    //         {
    //           value: `역시, 예상이 맞았어  \n이제 두 개 남았다!`,
    //           size: 'normal',
    //         },
    //       ],
    //     ]);
    //   },
    // },
  ];
