import { CanvasDataRefs, PixiDataRefs } from './DataRefs';

export type onAnimateCallback<Type extends 'canvas' | 'pixi'> = {
  canvas: (params: CanvasDataRefs, currentFrame: number) => void;
  pixi: (params: PixiDataRefs, currentFrame: number) => void;
}[Type];

export type CanvasHandlers = {
  onAnimate?: onAnimateCallback<'canvas'>;
};

export type PixiHandlers = {
  onAnimate?: onAnimateCallback<'pixi'>;
};
