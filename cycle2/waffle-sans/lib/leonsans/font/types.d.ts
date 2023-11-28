import { Vector } from '../core/vector';

declare global {
  type MoveCommand = 'm';
  type LineCommand = 'l';
  type ArcCommand = 'a';
  type BezierCommand = 'b';

  type PathCommand = MoveCommand | LineCommand | ArcCommand | BezierCommand;

  type PathRatio = {
    x?: number;
    y?: number;
    r?: number; // rotation : if the rotation is ROTATE_NONE, it will hide in the 'pattern' and 'paths'
    p?: number; // 1 is hide the point in the pattern paths
    f?: number; // 1 is fixed position for wave paths
    c?: number; // 1 is close path for PIXI bug - graphics.closePath()
    v?: number; // 1 is vertex, it's only for the vertex shape like V, W, A
  };

  type Path = [PathCommand, ...number, PathRatio?];

  type RawPathData = {
    d: 1 | -1;
    v: Path[];
  };

  type PathData = {
    d: 1 | -1;
    v: Vector[];
  };

  type FontData = {
    v?: string;
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

  type CloneableFontData = FontData & {
    clone: () => FontData;
  };
}
