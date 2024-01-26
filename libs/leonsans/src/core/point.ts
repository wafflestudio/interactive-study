import { PathCommand, PathRatio } from '../font/types';
import { Position } from './types';

type PointProps = {
  type: PathCommand;
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
  hide?: 1 | 0;
  fixed?: 1 | 0;
  distance?: number;
  vertex?: number;
  start?: number;
};

export class Point {
  type: PathCommand;
  x: number;
  y: number;
  x2?: number; // for bezier
  y2?: number; // for bezier
  x3?: number; // for bezier
  y3?: number; // for bezier
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
  vertex?: number; // 1에 가까울 수록 vertex와 가까움. 1이면 vertex이고, Pattern에서 사용
  start?: number;

  constructor(mp: PointProps) {
    this.type = mp.type;
    this.x = mp.x;
    this.y = mp.y;
    this.x2 = mp.x2;
    this.y2 = mp.y2;
    this.x3 = mp.x3;
    this.y3 = mp.y3;
    this.rx = mp.rx;
    this.ry = mp.ry;
    this.sx = mp.sx;
    this.sy = mp.sy;
    this.ratio = mp.ratio;
    this.radius = mp.radius;
    this.rotation = mp.rotation;
    this.hide = mp.hide;
    this.fixed = mp.fixed;
    this.distance = mp.distance;
    this.vertex = mp.vertex;
    this.start = mp.start;
  }

  addRect(pos: Position): Point {
    const vv = new Point(this);
    vv.x = this.x + pos.x;
    vv.y = this.y + pos.y;
    if (this.type === 'b') {
      vv.x2 = this.x2! + pos.x;
      vv.y2 = this.y2! + pos.y;
      vv.x3 = this.x3! + pos.x;
      vv.y3 = this.y3! + pos.y;
    }
    vv.rx = this.rx && this.rx + pos.x;
    vv.ry = this.ry && this.ry + pos.y;
    vv.sx = this.sx && this.sx + pos.x;
    vv.sy = this.sy && this.sy + pos.y;
    vv.radius = Math.max(vv.radius ?? 0.5, 0.5);
    return vv;
  }
}
