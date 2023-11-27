import gsap, { Power3 } from 'gsap';
import { useCallback, useState } from 'react';

import LeonCanvas from '../components/LeonCanvas';
import { useDispatcher } from '../hooks/useDispatcher';
import { CanvasDataRefs } from '../types/DataRefs';

const canvasWidth = 800;
const canvasHeight = 600;

export default function LeonCanvasExample() {
  const [isWave, setIsWave] = useState(true);
  const [text, setText] = useState('Leon Sans');
  const dispatcher = useDispatcher();

  const redraw = useCallback(() => {
    dispatcher.send(({ leon }) => {
      for (let i = 0; i < leon.drawing.length; i++) {
        gsap.killTweensOf(leon.drawing[i]);
        gsap.fromTo(
          leon.drawing[i],
          {
            value: 0,
          },
          {
            value: 1,
            ease: Power3.easeOut,
            duration: 2,
          },
        );
      }
    });
  }, [dispatcher]);

  const wave = useCallback(({ leon, ctx }: CanvasDataRefs, t: number) => {
    leon.wave(ctx, t);
  }, []);

  return (
    <div>
      <LeonCanvas
        text={text}
        width={canvasWidth}
        height={canvasHeight}
        dispatcher={dispatcher}
        isDraw={!isWave}
        isWave={isWave}
        weight={isWave ? 1 : 400}
        onAnimate={isWave ? wave : undefined}
        pathGap={0.3}
        amplitude={0.3}
        fps={30}
      />
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={() => setIsWave(!isWave)}>웨이브</button>
        <button onClick={() => redraw()}>다시 쓰기</button>
      </div>
    </div>
  );
}
