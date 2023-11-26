import gsap, { Power3 } from 'gsap';
import { useCallback, useState } from 'react';

import LeonCanvas from './components/LeonCanvas';
import { useDispatcher } from './hooks/useDispatcher';

const canvasWidth = 800;
const canvasHeight = 600;

function App() {
  const [text, setText] = useState('Leon Sans');
  const dispatcher = useDispatcher();

  const redraw = useCallback(() => {
    dispatcher.update(({ leon }) => {
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
      <LeonCanvas
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

export default App;
