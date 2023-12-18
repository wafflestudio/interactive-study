import gsap, { Power0, Power3 } from 'gsap';
import { Point } from 'leonsans';
import * as PIXI from 'pixi.js';
import { useCallback, useEffect, useRef, useState } from 'react';

import LeonPixi from '../components/LeonPixi';
import { usePixiDispatcher } from '../hooks/usePixiDispatcher';

// import { onAnimateCallback } from '../types/Handler';

const canvasWidth = 800;
const canvasHeight = 600;

function randomIdx(arr: unknown[]) {
  return Math.floor(Math.random() * arr.length);
}

export default function LeonPixiExample() {
  const [text, setText] = useState('Leon Pixi');
  const dispatcher = usePixiDispatcher();

  const leaves = useRef<PIXI.SpriteSource[]>([]);
  const leafContainers = useRef<PIXI.Container[]>([]);

  const removeAllContainers = useCallback(() => {
    leafContainers.current.forEach((c) => c.destroy());
    leafContainers.current = [];
  }, []);

  const makeContainer = useCallback(() => {
    const container = new PIXI.Container();
    leafContainers.current.push(container);
    dispatcher.send(({ stage }) => stage.addChild(container));
    return container;
  }, [dispatcher]);

  const drawLeaves = useCallback(
    (points: Point[]) => {
      const container = makeContainer();

      dispatcher.send(({ leon }) => {
        container.position.set(leon.rect.x, leon.rect.y);
        points
          .filter((pos, i) => pos.type == 'a' || i % 11 > 6)
          .forEach((pos, i, every) => {
            const total = every.length;
            const d = leaves.current[randomIdx(leaves.current)];
            const leaf = PIXI.Sprite.from(d);
            leaf.anchor.set(0.5);
            leaf.x = pos.x - leon.rect.x;
            leaf.y = pos.y - leon.rect.y;
            leaf.scale.set(0);
            const scale = leon.scale * 0.3;
            container.addChild(leaf);
            gsap.to(leaf.scale, {
              delay: (i / total) * 1 + 0.95,
              x: scale,
              y: scale,
              ease: Power3.easeOut,
              duration: 0.5,
            });
          });
      });
    },
    [dispatcher, makeContainer],
  );

  /**
   * 글자 다시 쓰는 애니메이션
   */
  const redraw = useCallback(() => {
    dispatcher.send(({ leon }) => {
      leon.updateDrawingPaths();

      for (let i = 0; i < leon.drawing.length; i++) {
        gsap.killTweensOf(leon.drawing[i]);
        gsap.fromTo(
          leon.drawing[i],
          {
            value: 0,
          },
          {
            value: 1,
            ease: Power0.easeNone,
            duration: 1,
          },
        );
      }

      removeAllContainers();
      leon.data.forEach((d) => drawLeaves(d.drawingPaths));
    });
  }, [dispatcher, drawLeaves, removeAllContainers]);

  /**
   * 마운트 될 때 잎사귀 데이터를 미리 로드
   */
  useEffect(() => {
    if (leaves.current.length != 0) return;
    // using IIFE to use async/await
    (async () => {
      for (let i = 1; i <= 20; i++) {
        const leaf = await PIXI.Assets.load<PIXI.SpriteSource>(
          `leaves/leaf_${i}.svg`,
        );
        leaves.current.push(leaf);
      }
    })();

    dispatcher.send(({ leon }) => {
      leon.on('update', () =>
        leafContainers.current.forEach((c) =>
          c.position.set(leon.rect.x, leon.rect.y),
        ),
      );
    });
  }, []);

  return (
    <div>
      <LeonPixi
        text={text}
        color={'#704234'}
        size={130}
        width={canvasWidth}
        height={canvasHeight}
        dispatcher={dispatcher}
        // onAnimate={animateLeaves}
      />
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={() => redraw()}>다시 쓰기</button>
      </div>
    </div>
  );
}
