import { Model } from './model.js';
import { Point } from './point';

export class Vector {
  type: Command;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  x3?: number;
  y3?: number;
  ratio: PathRatio;

  constructor(mp: Path | Vector) {
    if (mp instanceof Vector) {
      this.type = mp.type;
      this.x = mp.x;
      this.y = mp.y;
      this.x2 = mp.x2;
      this.y2 = mp.y2;
      this.x3 = mp.x3;
      this.y3 = mp.y3;
      this.ratio = mp.ratio;
      return;
    }

    this.type = mp[0];

    this.x = mp[1] || 0;
    this.y = mp[2] || 0;

    if (this.type == 'b') {
      this.x2 = mp[3] || 0;
      this.y2 = mp[4] || 0;
      this.x3 = mp[5] || 0;
      this.y3 = mp[6] || 0;
      if (mp[7] == null) {
        this.ratio = {
          x: 1,
          y: 1,
          r: 0,
          p: 0,
          f: 0,
          c: 0,
          v: 0,
        };
      } else {
        this.ratio = {};
        this.ratio.x = mp[7].x == null ? 1 : mp[7].x;
        this.ratio.y = mp[7].y == null ? 1 : mp[7].y;
        this.ratio.r = mp[7].r || 0;
        this.ratio.p = mp[7].p || 0;
        this.ratio.f = mp[7].f || 0;
        this.ratio.c = mp[7].c || 0;
        this.ratio.v = mp[7].v || 0;
      }
    } else {
      if (mp[3] == null) {
        this.ratio = {
          x: 1,
          y: 1,
          r: 0,
          p: 0,
          f: 0,
          c: 0,
          v: 0,
        };
      } else {
        this.ratio = {};
        this.ratio.x = mp[3].x == null ? 1 : mp[3].x;
        this.ratio.y = mp[3].y == null ? 1 : mp[3].y;
        this.ratio.r = mp[3].r || 0;
        this.ratio.p = mp[3].p || 0;
        this.ratio.f = mp[3].f || 0;
        this.ratio.c = mp[3].c || 0;
        this.ratio.v = mp[3].v || 0;
      }
    }
  }

  convert(pos: any, model: Model) {
    const x = this.convertX(this.x, pos, this.ratio, model);
    const y = this.convertY(this.y, pos, this.ratio, model);
    const x2 = this.convertX(this.x2, pos, this.ratio, model);
    const y2 = this.convertY(this.y2, pos, this.ratio, model);
    const x3 = this.convertX(this.x3, pos, this.ratio, model);
    const y3 = this.convertY(this.y3, pos, this.ratio, model);
    const rd = this.convertR(this.type, pos, model);

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

  private convertR(type: Command, pos: any, model: Model) {
    let rd = 0;
    if (type == 'a') rd = pos.range.cr * model.scale * model.fontRatio;
    return rd;
  }

  private convertX(
    x: number | undefined,
    pos: any,
    ratio: PathRatio,
    model: Model,
  ) {
    const rr = pos.range.r * ratio.x!;
    const gx = (pos.range.gx2 - pos.range.gx1) * rr + pos.range.gx1;
    const fr = (pos.range.fr2 - pos.range.fr1) * rr + pos.range.fr1;
    return pos.center.x + (x! - gx) * model.scale * fr; // + pos.rect.x
  }

  private convertY(
    y: number | undefined,
    pos: any,
    ratio: PathRatio,
    model: Model,
  ) {
    const rr = pos.range.r * ratio.y!;
    const gy = (pos.range.gy2 - pos.range.gy1) * rr + pos.range.gy1;
    const fr = (pos.range.fr2 - pos.range.fr1) * rr + pos.range.fr1;
    return pos.center.y + (y! - gy) * model.scale * fr; // + pos.rect.y
  }
}
