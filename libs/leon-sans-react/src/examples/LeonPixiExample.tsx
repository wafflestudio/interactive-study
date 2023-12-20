import gsap, { Power0, Power3 } from 'gsap';
import { CHARSET, ModelData } from 'leonsans';
import * as PIXI from 'pixi.js';
import { useCallback, useEffect, useRef, useState } from 'react';

import LeonPixi from '../components/LeonPixi';
import { usePixiDispatcher } from '../hooks/usePixiDispatcher';

const TYPO_EASING = Power0.easeNone;
const TYPO_DRAWING_DURATION = 1;

const LEAVES_EASING = Power3.easeOut;
const LEAVES_DRAWING_SPEED = 1;
const LEAVES_DRAWING_DELAY = TYPO_DRAWING_DURATION - 0.05;

const INITIAL_TEXT = 'Leon Pixi';

function randomIdx(arr: unknown[]) {
  return Math.floor(Math.random() * arr.length);
}

export default function LeonPixiExample() {
  const [windowSize, setWindowSize] = useState<[number, number]>([
    window.innerWidth,
    window.innerHeight - 100,
  ]);
  const canvasWidth = windowSize[0];
  const canvasHeight = windowSize[1];

  const inputRef = useRef<HTMLInputElement>(null);
  const dispatcher = usePixiDispatcher();

  const leafSources = useRef<PIXI.SpriteSource[]>([]);
  const leafContainers = useRef<PIXI.Container[]>([]);

  const removeContainers = (
    start: number = 0,
    end: number = leafContainers.current.length,
  ) => {
    leafContainers.current.slice(start, end).forEach((c) => c.destroy());
    leafContainers.current = [
      ...leafContainers.current.slice(0, start),
      ...leafContainers.current.slice(end),
    ];
  };

  const makeContainer = useCallback(
    (idx: number = leafContainers.current.length) => {
      const container = new PIXI.Container();
      dispatcher.send(({ leon, stage }) => {
        leafContainers.current = [
          ...leafContainers.current.slice(0, idx),
          container,
          ...leafContainers.current.slice(idx),
        ];
        container.position.set(leon.data[idx].rect.x, leon.data[idx].rect.y);
        stage.addChild(container);
      });
      return container;
    },
    [dispatcher],
  );

  const drawLeaves = useCallback(
    (typo: ModelData, container: PIXI.Container) => {
      dispatcher.send(({ leon }) => {
        typo.drawingPaths
          .filter((pos, i) => pos.type == 'a' || i % 11 > 6)
          .forEach((pos, i, every) => {
            const total = every.length;
            const source = leafSources.current[randomIdx(leafSources.current)];
            const leafSprite = PIXI.Sprite.from(source);
            leafSprite.anchor.set(0.5);
            leafSprite.x = pos.x - typo.rect.x;
            leafSprite.y = pos.y - typo.rect.y;
            const scale = leon.scale * 0.3;
            container.addChild(leafSprite);
            gsap.fromTo(
              leafSprite.scale,
              {
                x: 0,
                y: 0,
              },
              {
                x: scale,
                y: scale,
                ease: LEAVES_EASING,
                duration: 0.5,
                delay:
                  (i / total) * LEAVES_DRAWING_SPEED + LEAVES_DRAWING_DELAY,
              },
            );
          });
      });
    },
    [dispatcher],
  );

  const drawTypo = useCallback((typo: ModelData) => {
    if (!typo) return;
    gsap.fromTo(
      typo.drawing,
      {
        value: 0,
      },
      {
        value: 1,
        ease: TYPO_EASING,
        duration: TYPO_DRAWING_DURATION,
      },
    );
  }, []);

  /**
   * 글자 다시 쓰는 애니메이션
   */
  const redraw = useCallback(() => {
    dispatcher.send(({ leon }) => {
      leon.updateDrawingPaths();

      for (let i = 0; i < leon.drawing.length; i++) {
        gsap.killTweensOf(leon.drawing[i]);
        drawTypo(leon.data[i]);
      }

      removeContainers();
      leon.data.forEach((d) => drawLeaves(d, makeContainer()));
    });
  }, [dispatcher, drawTypo, drawLeaves, makeContainer]);

  /**
   * 글자를 교체하고 다시 그리기
   *
   * @param text 교체할 텍스트
   */
  const replaceText = useCallback(
    (text: string) => {
      dispatcher.send(({ leon }) => {
        // set text
        leon.text = text;

        // recalculate position of new text
        const x = (canvasWidth - leon.rect.w) / 2;
        const y = (canvasHeight - leon.rect.h) / 2;
        leon.position(x, y);
      });

      // redraw
      redraw();
    },
    [dispatcher, canvasWidth, canvasHeight, redraw],
  );

  /**
   * n번째 위치에 글자 추가하기
   *
   * @param text 추가할 글자
   * @param idx 추가할 위치
   */
  const inserText = useCallback(
    (text: string, idx: number) => {
      dispatcher.send(({ leon }) => {
        // add text
        leon.text = leon.text.slice(0, idx) + text + leon.text.slice(idx);

        // recalculate position of new text
        const x = (canvasWidth - leon.rect.w) / 2;
        const y = (canvasHeight - leon.rect.h) / 2;
        leon.position(x, y);

        // update paths
        leon.updateDrawingPaths();

        // draw
        drawTypo(leon.data[idx]);
        drawLeaves(leon.data[idx], makeContainer(idx));
        leafContainers.current.forEach((container, idx) => {
          container.position.set(leon.data[idx].rect.x, leon.data[idx].rect.y);
        });
      });
    },
    [
      canvasHeight,
      canvasWidth,
      dispatcher,
      drawLeaves,
      drawTypo,
      makeContainer,
    ],
  );

  /**
   * n번째 위치의 글자 삭제하기
   *
   * @param idx 삭제할 위치
   * @param text 삭제 후 남은 텍스트
   */
  const deleteText = useCallback(
    (idx: number, text: string) => {
      dispatcher.send(({ leon }) => {
        // calculate number of deleted characters
        const n = leon.text.length - text.length;

        // delete text
        leon.text = leon.text.slice(0, idx) + leon.text.slice(idx + n);
        removeContainers(idx, idx + n);

        // recalculate position of new text
        const x = (canvasWidth - leon.rect.w) / 2;
        const y = (canvasHeight - leon.rect.h) / 2;
        leon.position(x, y);

        // update paths
        leon.updateDrawingPaths();

        // draw
        leafContainers.current.forEach((container, idx) => {
          container.position.set(leon.data[idx].rect.x, leon.data[idx].rect.y);
        });
      });
    },
    [canvasHeight, canvasWidth, dispatcher],
  );

  const onInputHandler = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const newText: string = e.currentTarget.value;
      const caretIdx = inputRef.current!.selectionStart!;
      const inputEvent = e.nativeEvent as InputEvent;
      const data = inputEvent.data;
      const inputType = inputEvent.inputType;
      if (inputType === 'insertText' || inputType === 'insertCompositionText') {
        // FIXME 줄바꿈 일단 막아놓음
        const isValid = CHARSET.includes(data!) || ' '.includes(data!);
        if (!isValid) {
          alert(`"${data}"는 허용되지 않는 문자입니다.`);
          inputRef.current!.value = inputRef.current!.value.replace(data!, '');
          return;
        }
        inserText(data!, inputRef.current!.selectionStart! - 1);
      } else if (
        inputType.startsWith('delete') &&
        e.currentTarget.value.length > 0
      ) {
        // delete text
        deleteText(caretIdx, e.currentTarget.value);
      } else {
        // replace text
        const isValid = newText
          .split('')
          .every((c) => CHARSET.includes(c) || ' \\'.includes(c));
        if (!isValid) {
          alert(`"${newText}"에는 허용되지 않는 문자가 포함되어 있습니다.`);
          inputRef.current!.value = inputRef.current!.value.replace(
            newText,
            '',
          );
          return;
        }
        replaceText(newText);
      }
    },
    [deleteText, inserText, replaceText],
  );

  const moveLeft = useCallback(() => {
    dispatcher.send(({ leon }) => leon.position(leon.rect.x - 10, leon.rect.y));
  }, [dispatcher]);

  const moveRight = useCallback(() => {
    dispatcher.send(({ leon }) => leon.position(leon.rect.x + 10, leon.rect.y));
  }, [dispatcher]);

  /**
   * 마운트 될 때 잎사귀 데이터를 미리 로드
   */
  useEffect(() => {
    if (leafSources.current.length != 0) return;
    // using IIFE to use async/await
    (async () => {
      for (let i = 1; i <= 20; i++) {
        const leaf = await PIXI.Assets.load<PIXI.SpriteSource>(
          `leaves/leaf_${i}.svg`,
        );
        leafSources.current.push(leaf);
      }
      redraw();
    })();
  }, []);

  /**
   * leonsans에 update 이벤트 핸들러 등록
   */
  useEffect(() => {
    dispatcher.send(({ leon }) => {
      leon.on('update', () =>
        leafContainers.current.forEach((c) =>
          c.position.set(leon.rect.x, leon.rect.y),
        ),
      );
    });
  }, []);

  /**
   * 마운트될 때 input에 INITIAL_TEXT 적용
   */
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = INITIAL_TEXT;
  }, []);

  /**
   * window resize
   */
  useEffect(() => {
    function handleResize() {
      setWindowSize([window.innerWidth, window.innerHeight - 100]);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <LeonPixi
        text={INITIAL_TEXT}
        color={'#704234'}
        size={130}
        width={canvasWidth}
        height={canvasHeight}
        dispatcher={dispatcher}
      />
      <div>
        <input ref={inputRef} type="text" onInput={onInputHandler} />
        <button onClick={() => redraw()}>다시 쓰기</button>
        <button onClick={() => moveLeft()}>{'<'}</button>
        <button onClick={() => moveRight()}>{'>'}</button>
      </div>
    </div>
  );
}
