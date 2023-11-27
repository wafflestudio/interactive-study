import { Vector } from './vector';

export class Point extends Vector {
  rx?: number;
  ry?: number;
  sx?: number;
  sy?: number;
  radius?: number;

  // @ts-ignore
  constructor(mp: Vector) {
    super(mp);
  }

  addRect(rect: any) {
    const vv = new Point(this);
    vv.x = this.x + rect.x;
    vv.y = this.y + rect.y;
    vv.x2 = this.x2 + rect.x;
    vv.y2 = this.y2 + rect.y;
    vv.x3 = this.x3 + rect.x;
    vv.y3 = this.y3 + rect.y;
    vv.rx = this.rx + rect.x;
    vv.ry = this.ry + rect.y;
    vv.sx = this.sx + rect.x;
    vv.sy = this.sy + rect.y;
    if (vv.radius !== undefined && vv.radius < 0.5) vv.radius = 0.5;
    return vv;
  }
}
