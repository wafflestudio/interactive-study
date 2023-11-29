import gsap, { Power3 } from 'gsap';
import { useCallback, useState } from 'react';
import LeonPixiMetaball from '../components/LeonPixiMetaball';
import { usePixiDispatcher } from '../hooks/usePixiDispatcher';

const canvasWidth = 800;
const canvasHeight = 600;
const particleTotal = 10000;

export default function LeonPixiMetaballExample() {
  const [text, setText] = useState('TOP\n678');
  const dispatcher = usePixiDispatcher();

  // TODO: 공통 로직 부분 utils로 묶기

  const redraw = useCallback(() => {
    dispatcher.send(({ leon }) => {
      for (let i = 0; i < particleTotal; i++) {
        /*
          gsap.killTweensOf(particles[i].scale);
          gsap.set(particles[i].scale, {
            x: 0,
            y: 0
          });
          gsap.to(particles[i].scale, 3, {
            delay: 0.001 * i,
            x: particles[i].saveScale,
            y: particles[i].saveScale,
            ease: Circ.easeOut
          });
        });
        */
      }
    });
  }, [dispatcher]);

  return (
    <div>
      <LeonPixiMetaball
        text={text}
        color="0xffffff"
        bgColor="0x000000"
        weight={700}
        width={canvasWidth}
        height={canvasHeight}
        particleTotal={particleTotal}
        dispatcher={dispatcher}
      />
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={() => redraw()}>Metaball Redraw</button>
      </div>
    </div>
  );
}
