import { useEffect } from 'react';

import LeonPixi from '../components/LeonPixi';
import LeonPixiController from '../components/LeonPixiControlPanel';
import { usePixiDispatcher } from '../hooks/usePixiDispatcher';

export default function LeonPixiExample() {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  const dispatcher = usePixiDispatcher();

  /**
   * window resize
   */
  useEffect(() => {
    function handleResize() {
      dispatcher.send((wreath) =>
        wreath.resize(window.innerWidth, window.innerHeight),
      );
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <LeonPixi
        initialText={'INTERACTIVE'}
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
