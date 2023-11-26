import { useCallback, useRef } from 'react';

type Leon = any; // TODO: Leon 타입 확정하기
type Data = { ctx: CanvasRenderingContext2D; leon: Leon };
type Updater = (params: Data) => void;

export const useDispatcher = () => {
  const dataRefs = useRef<Data | null>(null);

  const update = useCallback((updater: Updater) => {
    if (!dataRefs.current) return;
    updater(dataRefs.current);
  }, []);

  const dispatcher = (refs: Data) => {
    dataRefs.current = refs;
  };
  dispatcher.update = update;
  return dispatcher;
};
