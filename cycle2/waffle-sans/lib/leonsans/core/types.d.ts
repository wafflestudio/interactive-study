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
  c: number;
  r: number;
  l: number;
};

declare type Line = {
  type: string;
  rotation: number;
  pat: number;
  fix: number;
  vt: number;
};

declare type LineData = {
  type: PathCommand;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3?: number;
  y3?: number;
  x4?: number;
  y4?: number;
  distance: number;
  radius: number;
  rotation: number;
  pat: number;
  fix: number;
  vt: number;
};

declare type LinesLengths = {
  max: number;
  linesArray: LineData[][];
  lengths: number[];
};

declare type ModelData = {
  str: string;
  typo: FontData;
  rect: Rect;
  originPos: Position;
  center: Position;
  range: RatioRange;
  alignGapX?: AlignGapX;
  pointsLength?: LinesLengths;
  drawingPaths?: any;
  rawPaths?: any;
  rawWavePaths?: any;
  guide?: any;
  grid?: any;
};

declare type char = string;
