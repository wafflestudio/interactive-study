import { PATH_COMMANDS } from '../font/constants.js';
import { Model } from './model.js';
import { Point } from './point.js';

type VectorProps = {
  type: PathCommand;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  x3?: number;
  y3?: number;
  ratio: PathRatio;
};

function isVectorProps(obj: any): obj is VectorProps {
  return (
    obj.type in PATH_COMMANDS &&
    typeof obj.x === 'number' &&
    typeof obj.y === 'number'
  );
}

export class Vector {
  type: PathCommand;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  x3?: number;
  y3?: number;
  ratio: PathRatio;

  constructor(obj: TypoPathData | VectorProps) {
    if (isVectorProps(obj)) {
      this.type = obj.type;
      this.x = obj.x;
      this.y = obj.y;
      this.x2 = obj.x2;
      this.y2 = obj.y2;
      this.x3 = obj.x3;
      this.y3 = obj.y3;
      this.ratio = obj.ratio;
      return;
    }

    this.type = obj[0];

    this.x = obj[1] ?? 0;
    this.y = obj[2] ?? 0;

    if (obj[0] === 'b') {
      this.x2 = obj[3] ?? 0;
      this.y2 = obj[4] ?? 0;
      this.x3 = obj[5] ?? 0;
      this.y3 = obj[6] ?? 0;
    }

    const pathRatio = obj[0] === 'b' ? obj[7] : obj[3];
    this.ratio = {
      x: pathRatio?.x ?? 1,
      y: pathRatio?.y ?? 1,
      r: pathRatio?.r ?? 0,
      h: pathRatio?.h ?? 0,
      f: pathRatio?.f ?? 0,
      c: pathRatio?.c ?? 0,
      v: pathRatio?.v ?? 0,
    };
  }

  convert(data: ModelData, model: Model) {
    const x = this.convertX(this.x, data, this.ratio, model);
    const y = this.convertY(this.y, data, this.ratio, model);
    const x2 = this.convertX(this.x2!, data, this.ratio, model);
    const y2 = this.convertY(this.y2!, data, this.ratio, model);
    const x3 = this.convertX(this.x3!, data, this.ratio, model);
    const y3 = this.convertY(this.y3!, data, this.ratio, model);
    const rd = this.convertR(this.type, data, model);

    const vv = new Point(this);
    vv.x = x;
    vv.y = y;
    vv.x2 = x2;
    vv.y2 = y2;
    vv.x3 = x3;
    vv.y3 = y3;
    vv.radius = rd;

    return vv;
  }

  private convertR(type: PathCommand, data: ModelData, model: Model) {
    let rd = 0;
    if (type == 'a') rd = data.range.cr * model.scale * model.fontRatio;
    return rd;
  }

  private convertX(x: number, data: ModelData, ratio: PathRatio, model: Model) {
    const rr = data.range.r * ratio.x!;
    const gx = (data.range.gx2 - data.range.gx1) * rr + data.range.gx1;
    const fr = (data.range.fr2 - data.range.fr1) * rr + data.range.fr1;
    return data.center.x + (x - gx) * model.scale * fr; // + data.rect.x
  }

  private convertY(y: number, data: ModelData, ratio: PathRatio, model: Model) {
    const rr = data.range.r * ratio.y!;
    const gy = (data.range.gy2 - data.range.gy1) * rr + data.range.gy1;
    const fr = (data.range.fr2 - data.range.fr1) * rr + data.range.fr1;
    return data.center.y + (y - gy) * model.scale * fr; // + data.rect.y
  }
}
