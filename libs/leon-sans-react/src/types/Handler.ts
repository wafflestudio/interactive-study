import { CanvasDataRefs, PixiDataRefs } from './DataRefs';

type DataRefs = CanvasDataRefs | PixiDataRefs;

type OnAnimate<Params extends DataRefs> = (
  callback: (params: Params, currentFrame: number) => void,
) => void;

export type CanvasHandlers = {
  onAnimate?: Parameters<OnAnimate<CanvasDataRefs>>[0];
};

export type PixiHandlers = {
  onAnimate?: Parameters<OnAnimate<PixiDataRefs>>[0];
};
