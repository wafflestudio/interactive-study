import { useCallback, useRef } from 'react';

import { PixiDataRefs } from '../types/DataRefs';
import { PixiDispatcher } from '../types/Dispatcher';

export const usePixiDispatcher = (): PixiDispatcher => {
  const dataRefs = useRef<PixiDataRefs | null>(null);

  const initiate: PixiDispatcher['initiate'] = useCallback((refs) => {
    dataRefs.current = refs;
  }, []);

  const send: PixiDispatcher['send'] = useCallback((callback) => {
    if (!dataRefs.current) return;
    callback(dataRefs.current);
  }, []);

  return {
    initiate,
    send,
  };
};
