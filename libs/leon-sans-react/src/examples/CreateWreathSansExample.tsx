import { useEffect } from 'react';

import createWreathSans from '../hooks/createWreathSans';

const { WreathSansCanvas, onInputHandler, resize } = createWreathSans({
  initialText: '',
  width: window.innerWidth,
  height: window.innerHeight,
});

export default function LeonPixiExample() {
  /**
   * window resize
   */
  useEffect(() => {
    function handleResize() {
      resize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <WreathSansCanvas />
      <input onInput={onInputHandler} />
    </div>
  );
}
