import { useEffect, useState } from 'react';

import LeonPixi from '../components/LeonPixi';
import LeonPixiController from '../components/LeonPixiControlPanel';
import { usePixiDispatcher } from '../hooks/usePixiDispatcher';

export default function LeonPixiExample() {
  const [windowSize, setWindowSize] = useState<[number, number]>([
    window.innerWidth,
    window.innerHeight,
  ]);
  const canvasWidth = windowSize[0];
  const canvasHeight = windowSize[1];

  const dispatcher = usePixiDispatcher();

  /**
   * window resize
   */
  useEffect(() => {
    function handleResize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <LeonPixi
        initialText={''}
        color={'#704234'}
        size={130}
        width={canvasWidth}
        height={canvasHeight}
        dispatcher={dispatcher}
      />
      <LeonPixiController dispatcher={dispatcher} />
    </div>
  );
}
