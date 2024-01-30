import { useCallback, useMemo, useRef } from 'react';

import WreathSansController from '../domain/WreathSansController';
import { PixiDispatcher } from '../types/Dispatcher';

export const usePixiDispatcher = (): PixiDispatcher => {
  // const [wreath, setWreath] = useState<WreathSansController | null>(null);
  const wreathRef = useRef<WreathSansController | null>(null);

  const initiate: PixiDispatcher['initiate'] = useCallback((refs) => {
    wreathRef.current = refs;
  }, []);

  const send: PixiDispatcher['send'] = useCallback(
    (callback) => {
      if (!wreathRef.current) return;
      callback(wreathRef.current);
    },
    [],
  );

  const dispatcher = useMemo<PixiDispatcher>(() => {
    return {
      initiate,
      send,
    };
  }, [initiate, send]);

  return dispatcher;
};
