import { Vector } from '../core/vector';
import { BEZIER_COMMAND, PATH_COMMANDS } from './constants';

export type PathCommand = (typeof PATH_COMMANDS)[number];

export type PathRatio = {
  x: number;
  y: number;
  r: number; // rotation : if the rotation is ROTATE_NONE, it will hide in the 'pattern' and 'paths'
  h: 1 | 0; // 1 is hide the point in the pattern paths
  f: 1 | 0; // 1 is fixed position for wave paths
  c: 1 | 0; // 1 is close path for PIXI bug - graphics.closePath()
  v: 1 | 0; // 1 is vertex, it's only for the vertex shape like V, W, A
};

export type SimplePathData = [
  Exclude<PathCommand, typeof BEZIER_COMMAND>,
  number, // x
  number, // y
  Partial<PathRatio>?,
];

export type BezierPathData = [
  typeof BEZIER_COMMAND,
  number, // x1
  number, // y1
  number, // x2
  number, // y2
  number, // x3
  number, // y3
  Partial<PathRatio>?,
];

export type TypoPathData = SimplePathData | BezierPathData;

export type TypoData = {
  d: 1 | -1; // direction
  v: TypoPathData[];
};

export type TypoPath = {
  d: 1 | -1; // direction
  v: Vector[];
  cv?: Point[];
};

export type Typo = {
  character?: char;
  rect: {
    width: number;
    height: number;
    contentWidth: number;
    contentHeight: number;
  };
  ratio: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
  p: TypoPath[];
  clone: () => Typo;
};
