import * as PIXI from 'pixi.js';
import { ModelData } from '../../core/types';

type ColorSource = PIXI.ColorSource;

export function PixiColor(
  no: number,
  // @ts-ignore
  data: ModelData,
  colorSet: (ColorSource | ColorSource[])[],
): ColorSource {
  const currentIndex =
    (no + colorSet.length * (Math.abs((no / 10) | 0) + 1)) % colorSet.length;
  const currentColor = colorSet[currentIndex];
  if (Array.isArray(currentColor)) {
    // c_total = currentColor.length;
    // const vv = 1 / (c_total - 1);
    // const g = ctx.createLinearGradient(data.rect.x, data.rect.y, data.rect.x, data.rect.y + data.rect.h);
    // let i;
    // for (i = 0; i < c_total; i++) {
    //     g.addColorStop(vv * i, currentColor[i]);
    // }
    // ctx.strokeStyle = g;
    // ctx.fillStyle = g;
    // c_total = currentColor.length;
    // const vv = 1 / (c_total - 1);
    // const c = document.createElement("canvas");
    // const ctx = c.getContext("2d");
    // const g = ctx.createLinearGradient(0, 0, data.rect.w, data.rect.h);
    // let i;
    // for (i = 0; i < c_total; i++) {
    //     g.addColorStop(vv * i, currentColor[i]);
    // }
    // ctx.fillStyle = g;
    // ctx.fillRect(0, 0, data.rect.w, data.rect.h);
    // return PIXI.Texture.from(c);
    return currentColor[0];
  } else {
    return currentColor;
  }
}
