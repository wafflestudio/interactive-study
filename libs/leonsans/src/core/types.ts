import { BEZIER_COMMAND } from '../font/constants';
import { PathCommand, Typo } from '../font/types';
import { Point } from './point';


export type Position = {
    x: number;
    y: number;
  };

  export type GuidePosition = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };

  export type RatioRange = {
    r: number;
    cr: number;
    fr1: number;
    fr2: number;
    gx1: number;
    gx2: number;
    gy1: number;
    gy2: number;
  };

  export type Rect = Position & {
    w: number;
    h: number;
  };

  export type Align = 'center' | 'right' | 'left';

  export type AlignGapX = {
    center: number;
    right: number;
    left: number;
  };

  export type CommonLineData = {
    distance: number; // Length of the line
    radius?: number;
    rotation?: number;
    hide?: 1 | 0;
    fixed?: 1 | 0;
    vertex?: 1 | 0;
  };

  export type SimpleLineData = CommonLineData & {
    type: Exclude<PathCommand, typeof BEZIER_COMMAND>;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };

  export type BezierCurveData = CommonLineData & {
    type: typeof BEZIER_COMMAND;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
    x4: number;
    y4: number;
  };

  export type LineData = SimpleLineData | BezierCurveData;

  export type LinesLengths = {
    max: number;
    linesArray: LineData[][];
    lengths: number[];
  };

  export type ModelDataLine = {
    pos: Point;
    drawing: Drawing;
    direction: 1 | -1;
    lengths: number;
    maxDrawing: number;
    minDrawing: number;
    closePath: 1 | 0;
    stroke(ctx: CanvasRenderingContext2D, d: ModelDataLine): void;
  };

  export type Drawing = {
    value: number;
    pos?: Position;
  };

  export type ModelData = {
    str: string;
    typo: Typo;
    rect: Rect;
    originPos: Position;
    center: Position;
    range: RatioRange;
    alignGapX: AlignGapX;
    pointsLength: LinesLengths;
    drawing: Drawing;
    drawingPaths: Point[];
    relativePatternPaths: Point[];
    relativeWavePaths: Point[];
    patternPaths: Point[];
    wavePaths: Point[];
    guide: GuidePosition[];
    grid: number[];
    lines: ModelDataLine[];
  };

  export type char = string;