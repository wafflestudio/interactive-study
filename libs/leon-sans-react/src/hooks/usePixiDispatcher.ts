import { useCallback, useMemo, useRef } from 'react';

import { PixiDispatcher } from '../types/Dispatcher';
import WreathSans from '../domain/WreathSans';

export const usePixiDispatcher = (): PixiDispatcher => {
  const dataRefs = useRef<WreathSans | null>(null);

  const initiate: PixiDispatcher['initiate'] = useCallback((refs) => {
    dataRefs.current = refs;
  }, []);

  const send: PixiDispatcher['send'] = useCallback((callback) => {
    if (!dataRefs.current) return;
    callback(dataRefs.current);
  }, []);

  const dispatcher = useMemo<PixiDispatcher>(() => {
    return {
      initiate,
      send,
    };
  }, [initiate, send]);

  return dispatcher;
};
