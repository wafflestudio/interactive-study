import { useCallback, useRef } from 'react';

import { CanvasDataRefs } from '../types/DataRefs';
import { CanvasDispatcher } from '../types/Dispatcher';

export const useDispatcher = (): CanvasDispatcher => {
  const dataRefs = useRef<CanvasDataRefs | null>(null);

  const initiate: CanvasDispatcher['initiate'] = useCallback((refs) => {
    dataRefs.current = refs;
  }, []);

  const send: CanvasDispatcher['send'] = useCallback((callback) => {
    if (!dataRefs.current) return;
    callback(dataRefs.current);
  }, []);

  return {
    initiate,
    send,
  };
};
