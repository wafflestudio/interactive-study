import * as PIXI from 'pixi.js';
import { useCallback, useRef } from 'react';

type Leon = any; // TODO: Leon 타입 확정하기
type Data = {
  leon: Leon;
  canvas: HTMLCanvasElement;
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  graphics: PIXI.Graphics;
};
type Updater = (params: Data) => void;

export const usePixiDispatcher = () => {
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
