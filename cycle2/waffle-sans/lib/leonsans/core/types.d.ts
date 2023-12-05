declare type Position = {
  x: number;
  y: number;
};

declare type GuidePosition = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

declare type RatioRange = {
  r: number;
  cr: number;
  fr1: number;
  fr2: number;
  gx1: number;
  gx2: number;
  gy1: number;
  gy2: number;
};

declare type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

declare type Align = 'center' | 'right' | 'left';

declare type AlignGapX = {
  center: number;
  right: number;
  left: number;
};

declare type CommonLineData = {
  distance: number; // Length of the line
  radius?: number;
  rotation?: number;
  hide?: 1 | 0;
  fixed?: 1 | 0;
  vertex?: 1 | 0;
};

declare type SimpleLineData = CommonLineData & {
  type: Exclude<PathCommand, typeof BEZIER_COMMAND>;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

declare type BezierCurveData = CommonLineData & {
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

declare type LineData = SimpleLineData | BezierCurveData;

declare type LinesLengths = {
  max: number;
  linesArray: LineData[][];
  lengths: number[];
};

declare type ModelData = {
  str: string;
  typo: Typo;
  rect: Rect;
  originPos: Position;
  center: Position;
  range: RatioRange;
  alignGapX: AlignGapX;
  pointsLength?: LinesLengths;
  drawingPaths?: any;
  rawPaths?: any;
  rawWavePaths?: any;
  paths?: any;
  wavePaths?: any;
  guide?: GuidePosition[];
  grid?: number[];
  drawing?: any;
};

declare type char = string;
