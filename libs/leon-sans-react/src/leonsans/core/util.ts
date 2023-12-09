import {
  DEFAULT_FONT_SIZE,
  FONT_RATIO_1,
  FONT_RATIO_2,
  FONT_WEIGHT_LIMIT,
  MAX_FONT_WEIGHT,
  MAX_LINE_WIDTH,
  MAX_SHAKE,
  MIN_FONT_WEIGHT,
  RECT_RATIO,
} from './constants';
import { Point } from './point';

export function getAmplitude(amplitude: number, scale: number) {
  return MAX_SHAKE * amplitude * scale;
}

export function getFontW(weight: number) {
  return (
    ((MAX_LINE_WIDTH - MIN_FONT_WEIGHT) / (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT)) *
      (weight - MIN_FONT_WEIGHT) +
    MIN_FONT_WEIGHT
  );
}

export function getWeightRatio(fontW: number) {
  return (fontW - MIN_FONT_WEIGHT) / (FONT_WEIGHT_LIMIT - MIN_FONT_WEIGHT);
}

export function getCircleRound(fontW: number) {
  return (
    ((58 - 4) / (FONT_WEIGHT_LIMIT - MIN_FONT_WEIGHT)) *
      (fontW - MIN_FONT_WEIGHT) +
    4
  );
}

export function getScale(size: number) {
  return size / DEFAULT_FONT_SIZE;
}

export function getLineW(fontW: number, scale: number) {
  let lw = fontW * scale;
  if (lw < 1) lw = 1;
  //if (weight == 1) lw = 1
  return lw;
}

export function getTracking(tracking: number, scale: number) {
  return tracking * 50 * scale;
}

export function getLeading(leading: number, scale: number) {
  return leading * 50 * scale;
}

export function getFontRatio(weightRatio: number) {
  return (FONT_RATIO_2 - FONT_RATIO_1) * weightRatio + FONT_RATIO_1;
}

export function getScaledRect(data: Typo, scale: number, x = 0, y = 0): Rect {
  const w = data.rect.width * RECT_RATIO * scale;
  const h = (data.rect.height + 220) * RECT_RATIO * scale;
  return {
    x,
    y,
    w,
    h,
  };
}

/**
 * @name getGap
 * @property {Object} - typo data object from 'font/index.js'
 * @property {Number} - weightRatio
 * @returns {Object} the gap x and y
 * @description get a typo gap from thin to bold weight
 */
/*
export function getGap(d, weightRatio) {
    const gx1 = d.ratio.x1
    const gx2 = d.ratio.x2
    const gy1 = d.ratio.y1
    const gy2 = d.ratio.y2
    const x = (gx2 - gx1) * weightRatio + gx1
    const y = (gy2 - gy1) * weightRatio + gy1
    return {
        x: x,
        y: y
    }
}
*/

/**
 * @name getCenter
 * @property {Number} - typo rect width
 * @property {Number} - typo rect height
 * @property {Number} - typo scale
 * @returns {Object} center position x and y
 * @description get a center position of a typo
 */
export function getCenter(w: number, h: number, scale: number) {
  const x = w / 2;
  const y = (h - (220 - 90) * RECT_RATIO * scale) / 2;
  return {
    x: x,
    y: y,
  };
}

/**
 * @name getRange
 * @property {Object} - typo data object from 'font/index.js'
 * @property {Number} - weightRatio
 * @property {Number} - circleRound
 * @returns {Object} ratio range
 * @description save ratio range to control each line's coordinate
 */
export function getRange(
  d: Typo,
  weightRatio: number,
  circleRound: number,
): RatioRange {
  const gx1 = d.ratio.x1;
  const gx2 = d.ratio.x2;
  const gy1 = d.ratio.y1;
  const gy2 = d.ratio.y2;
  return {
    r: weightRatio,
    cr: circleRound,
    fr1: FONT_RATIO_1,
    fr2: FONT_RATIO_2,
    gx1: gx1,
    gx2: gx2,
    gy1: gy1,
    gy2: gy2,
  };
}

export function getCurrent(
  v: number,
  vmax: number,
  vmin: number,
  max: number,
  min: number,
) {
  let value = ((max - min) / (vmax - vmin)) * (v - vmin) + min;
  if (value < min) value = min;
  else if (value > max) value = max;
  return value;
}

export function getLines(data: ModelData): ModelDataLine[] {
  return data.typo.p.flatMap((d2, i) =>
    d2.cv!.map((d3: Point) => {
      // add current position to all points
      const cp = d3.addRect(data.rect);
      const dir = d2.d;
      const lt = data.pointsLength.lengths[i];
      let prevRatio = 0;
      if (i > 0) {
        for (let k = 0; k < i; k++) {
          prevRatio += data.pointsLength.lengths[k] / data.pointsLength.max;
        }
      }
      const ltRatio = lt / data.pointsLength.max + prevRatio;

      return {
        pos: cp,
        drawing: data.drawing,
        direction: dir,
        lengths: lt,
        maxDrawing: ltRatio,
        minDrawing: prevRatio,
        closePath: d3.ratio!.c,
        stroke: (ctx: CanvasRenderingContext2D, d: ModelDataLine) => {
          const dv = getCurrent(
            d.drawing.value,
            d.maxDrawing,
            d.minDrawing,
            1,
            0,
          );
          //if (d.direction == 1) {
          //    dv = getCurrent(1 - d.drawing.value, d.minDrawing, d.maxDrawing, 1, 0);
          //}
          if (dv > 0 && d.pos.type != 'a') {
            const frac = d.lengths * dv;
            ctx.setLineDash([d.lengths]);
            ctx.lineDashOffset = d.direction * (frac + d.lengths);
            ctx.stroke();
          }
        },
      };
    }),
  );
}

/**
 *
 * @param path
 * @param data
 * @returns
 */
export function addRectToPaths(path: Point[], data: ModelData): Point[] {
  return path.map((p) => p.addRect(data.rect));
}

/**
 *
 * @returns random bright color as a css hsl format
 */
export function randomBrightColor(): string {
  return 'hsl(' + 360 * Math.random() + ',' + '100%,' + '50%)';
}

/**
 * copy the array and shuffle it
 * @param oldArray array to be shuffled
 * @returns shuffled array
 */
export function shuffle<T>(oldArray: T[]): T[] {
  return oldArray.slice().sort(() => Math.random() - 0.5);
}
