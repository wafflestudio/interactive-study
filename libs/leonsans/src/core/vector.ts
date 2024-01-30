import { PathCommand, PathRatio, TypoPathData } from '../font/types.js';
import { Model } from './model.js';
import { Point } from './point.js';
import { ModelData } from './types.js';

export class Vector {
  type: PathCommand;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  x3?: number;
  y3?: number;
  ratio: PathRatio;

  constructor(obj: TypoPathData) {
    this.type = obj[0];

    this.x = obj[1];
    this.y = obj[2];

    if (obj[0] === 'b') {
      this.x2 = obj[3];
      this.y2 = obj[4];
      this.x3 = obj[5];
      this.y3 = obj[6];
    }

    const pathRatio = obj[0] === 'b' ? obj[7] : obj[3];
    this.ratio = {
      x: pathRatio?.x ?? 1,
      y: pathRatio?.y ?? 1,
      r: pathRatio?.r ?? 0,
      p: pathRatio?.p ?? 0,
      h: pathRatio?.h ?? 0,
      f: pathRatio?.f ?? 0,
      c: pathRatio?.c ?? 0,
      v: pathRatio?.v ?? 0,
    };
  }

  convert(data: Pick<ModelData, 'range' | 'center'>, model: Model) {
    const vv = new Point(this);

    vv.x = this.convertX(this.x, data, this.ratio, model);
    vv.y = this.convertY(this.y, data, this.ratio, model);
    if (this.type === 'b') {
      vv.x2 = this.convertX(this.x2!, data, this.ratio, model);
      vv.y2 = this.convertY(this.y2!, data, this.ratio, model);
      vv.x3 = this.convertX(this.x3!, data, this.ratio, model);
      vv.y3 = this.convertY(this.y3!, data, this.ratio, model);
    }
    vv.radius = this.convertR(this.type, data, model);

    return vv;
  }

  private convertR(
    type: PathCommand,
    data: Pick<ModelData, 'range' | 'center'>,
    model: Model,
  ) {
    let rd = 0;
    if (type == 'a') rd = data.range.cr * model.scale * model.fontRatio;
    return rd;
  }

  private convertX(
    x: number,
    data: Pick<ModelData, 'range' | 'center'>,
    ratio: PathRatio,
    model: Model,
  ) {
    const rr = data.range.r * ratio.x;
    const gx = (data.range.gx2 - data.range.gx1) * rr + data.range.gx1;
    const fr = (data.range.fr2 - data.range.fr1) * rr + data.range.fr1;
    return data.center.x + (x - gx) * model.scale * fr; // + data.rect.x
  }

  private convertY(
    y: number,
    data: Pick<ModelData, 'range' | 'center'>,
    ratio: PathRatio,
    model: Model,
  ) {
    const rr = data.range.r * ratio.y;
    const gy = (data.range.gy2 - data.range.gy1) * rr + data.range.gy1;
    const fr = (data.range.fr2 - data.range.fr1) * rr + data.range.fr1;
    return data.center.y + (y - gy) * model.scale * fr; // + data.rect.y
  }
}
