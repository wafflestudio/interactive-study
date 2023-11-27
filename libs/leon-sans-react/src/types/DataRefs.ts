import * as PIXI from 'pixi.js';

type Leon = any; // TODO: Leon 타입 확정하기

export type CanvasDataRefs = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  leon: Leon;
  pixelRatio: number;
  isDraw: boolean;
};

export type PixiDataRefs = {
  canvas: HTMLCanvasElement;
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  graphics: PIXI.Graphics;
  leon: Leon;
  pixelRatio: number;
  isDraw: boolean;
};
