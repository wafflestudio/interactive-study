import { useCallback, useMemo, useState } from 'react';

import WreathSans from '../domain/WreathSans';
import { PixiDispatcher } from '../types/Dispatcher';

export const usePixiDispatcher = (): PixiDispatcher => {
  const [wreath, setWreath] = useState<WreathSans | null>(null);

  const initiate: PixiDispatcher['initiate'] = useCallback((refs) => {
    setWreath(refs);
  }, []);

  const send: PixiDispatcher['send'] = useCallback(
    (callback) => {
      if (!wreath) return;
      callback(wreath);
    },
    [wreath],
  );

  const dispatcher = useMemo<PixiDispatcher>(() => {
    return {
      initiate,
      send,
    };
  }, [initiate, send]);

  return dispatcher;
};
