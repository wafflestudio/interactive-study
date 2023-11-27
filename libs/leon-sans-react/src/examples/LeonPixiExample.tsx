import gsap, { Power3 } from 'gsap';
import { useCallback, useState } from 'react';

import LeonPixi from '../components/LeonPixi';
import { usePixiDispatcher } from '../hooks/usePixiDispatcher';

const canvasWidth = 800;
const canvasHeight = 600;

export default function LeonPixiExample() {
  const [text, setText] = useState('Leon Pixi');
  const dispatcher = usePixiDispatcher();

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
            ease: Power3.easeOut,
            duration: 2,
          },
        );
      }
    });
  }, [dispatcher]);

  return (
    <div>
      <LeonPixi
        text={text}
        width={canvasWidth}
        height={canvasHeight}
        dispatcher={dispatcher}
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
