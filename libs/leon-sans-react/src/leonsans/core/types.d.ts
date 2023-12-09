import { BEZIER_COMMAND } from '../font/constants';
import { Point } from './point';

declare global {
  type Position = {
    x: number;
    y: number;
  };

  type GuidePosition = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };

  type RatioRange = {
    r: number;
    cr: number;
    fr1: number;
    fr2: number;
    gx1: number;
    gx2: number;
    gy1: number;
    gy2: number;
  };

  type Rect = Position & {
    w: number;
    h: number;
  };

  type Align = 'center' | 'right' | 'left';

  type AlignGapX = {
    center: number;
    right: number;
    left: number;
  };

  type CommonLineData = {
    distance: number; // Length of the line
    radius?: number;
    rotation?: number;
    hide?: 1 | 0;
    fixed?: 1 | 0;
    vertex?: 1 | 0;
  };

  type SimpleLineData = CommonLineData & {
    type: Exclude<PathCommand, typeof BEZIER_COMMAND>;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };

  type BezierCurveData = CommonLineData & {
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

  type LineData = SimpleLineData | BezierCurveData;

  type LinesLengths = {
    max: number;
    linesArray: LineData[][];
    lengths: number[];
  };

  type ModelDataLine = {
    pos: Point;
    drawing: Drawing;
    direction: 1 | -1;
    lengths: number;
    maxDrawing: number;
    minDrawing: number;
    closePath: 1 | 0;
    stroke(ctx: CanvasRenderingContext2D, d: ModelDataLine): void;
  };

  type Drawing = {
    value: number;
  };

  type ModelData = {
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
    relativePaths: Point[];
    relativeWavePaths: Point[];
    paths: Point[];
    wavePaths: Point[];
    guide: GuidePosition[];
    grid: number[];
    lines: ModelDataLine[];
  };

  type char = string;
}
