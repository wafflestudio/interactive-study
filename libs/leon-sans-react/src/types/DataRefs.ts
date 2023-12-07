import * as PIXI from 'pixi.js';

import LeonSans from '../leonsans/leonsans';

export type CanvasDataRefs = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  leon: LeonSans;
  pixelRatio: number;
  isDraw: boolean;
};

export type PixiDataRefs = {
  canvas: HTMLCanvasElement;
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  graphics: PIXI.Graphics;
  leon: LeonSans;
  pixelRatio: number;
  isDraw: boolean;
};
