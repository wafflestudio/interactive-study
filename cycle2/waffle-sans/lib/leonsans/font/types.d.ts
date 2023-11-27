import { Vector } from '../core/vector';

type MoveCommand = 'm';
type LineCommand = 'l';
type ArcCommand = 'a';
type BezierCommand = 'b';

export type Command = MoveCommand | LineCommand | ArcCommand | BezierCommand;

export type PathRatio = {
  x?: number;
  y?: number;
  r?: number; // rotation : if the rotation is ROTATE_NONE, it will hide in the 'pattern' and 'paths'
  p?: number; // 1 is hide the point in the pattern paths
  f?: number; // 1 is fixed position for wave paths
  c?: number; // 1 is close path for PIXI bug - graphics.closePath()
  v?: number; // 1 is vertex, it's only for the vertex shape like V, W, A
};

export type Path = [Command, ...number, PathRatio?];

export type RawPathData = {
  d: 1 | -1;
  v: Path[];
};

export type PathData = {
  d: 1 | -1;
  v: Vector[];
};

export type FontData = {
  rect: {
    w: number;
    h: number;
    fw: number;
    fh: number;
  };
  ratio: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
  p: PathData[];
};

export type CloneableFontData = FontData & {
  clone: () => FontData;
};
