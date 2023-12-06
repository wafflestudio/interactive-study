import { Vector } from './vector';

type PointProps = {
  type?: PathCommand;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  x3?: number;
  y3?: number;
  rx?: number;
  ry?: number;
  sx?: number;
  sy?: number;
  ratio?: PathRatio;
  radius?: number;
  rotation?: number;
  hide?: number;
  fixed?: number;
  distance?: number;
  vetex?: number;
  start?: number;
};

export class Point {
  type?: PathCommand;
  x!: number;
  y!: number;
  x2?: number;
  y2?: number;
  x3?: number;
  y3?: number;
  rx?: number;
  ry?: number;
  sx?: number;
  sy?: number;
  ratio?: PathRatio;
  radius?: number;
  rotation?: number;
  hide?: 1 | 0;
  fixed?: 1 | 0;
  distance?: number;
  vetex?: number; // 1에 가까울 수록 vertex와 가까움. 1이면 vertex이고, Pattern에서 사용
  start?: number;

  constructor(mp: PointProps) {
    Object.assign(this, mp as PointProps);
  }

  addRect(rect: Rect): Point {
    const vv = new Point(this);
    vv.x = this.x + rect.x;
    vv.y = this.y + rect.y;
    vv.x2 = this.x2! + rect.x;
    vv.y2 = this.y2! + rect.y;
    vv.x3 = this.x3! + rect.x;
    vv.y3 = this.y3! + rect.y;
    vv.rx = this.rx! + rect.x;
    vv.ry = this.ry! + rect.y;
    vv.sx = this.sx! + rect.x;
    vv.sy = this.sy! + rect.y;
    vv.radius = vv.radius ?? 0.5;
    if (vv.radius < 0.5) vv.radius = 0.5;
    return vv;
  }
}
