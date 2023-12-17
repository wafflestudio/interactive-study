import { PathCommand, PathRatio } from "../font/types";
import { Position } from "./types";

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
  vertex?: number; // 1에 가까울 수록 vertex와 가까움. 1이면 vertex이고, Pattern에서 사용
  start?: number;

  constructor(mp: PointProps) {
    Object.assign(this, mp as PointProps);
  }

  addRect(pos: Position): Point {
    const vv = new Point(this);
    vv.x = this.x + pos.x;
    vv.y = this.y + pos.y;
    vv.x2 = this.x2! + pos.x;
    vv.y2 = this.y2! + pos.y;
    vv.x3 = this.x3! + pos.x;
    vv.y3 = this.y3! + pos.y;
    vv.rx = this.rx! + pos.x;
    vv.ry = this.ry! + pos.y;
    vv.sx = this.sx! + pos.x;
    vv.sy = this.sy! + pos.y;
    vv.radius = Math.max(vv.radius ?? 0.5, 0.5);
    return vv;
  }
}
