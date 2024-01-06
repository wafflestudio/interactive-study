import LeonSans from 'leonsans';
import * as PIXI from 'pixi.js';

export type CanvasDataRefs = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  leon: LeonSans;
  pixelRatio: number;
};

export type PixiDataRefs = {
  canvas: HTMLCanvasElement;
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  graphics: PIXI.Graphics;
  leon: LeonSans;
  pixelRatio: number;
};
