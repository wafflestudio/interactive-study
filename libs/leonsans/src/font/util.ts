import { partialBezierTangent } from '../core/paths.js';
import { Vector } from '../core/vector.js';
import { BEZIER_COMMAND, FONT_HEIGHT } from './constants.js';

/**
 * Generates font data based on the provided parameters.
 *
 * @param fontWidth The width of the font.
 * @param contentWidth The width of the font's frame.
 * @param contentHeight The height of the font's frame.
 * @param x1 The x-coordinate of the starting point of the font's ratio.
 * @param x2 The x-coordinate of the ending point of the font's ratio.
 * @param y1 The y-coordinate of the starting point of the font's ratio.
 * @param y2 The y-coordinate of the ending point of the font's ratio.
 * @param path An array of raw path data.
 * @returns The generated font data.
 */
export function generateFontData(
  fontWidth: number,
  contentWidth: number,
  contentHeight: number,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  path: TypoData[],
): CloneableTypo {
  const p: TypoPath[] = path.map((d) => ({
    d: d.d,
    v: setCenter(d.v, contentWidth, contentHeight),
  }));

  return {
    rect: {
      width: fontWidth,
      height: FONT_HEIGHT,
      contentWidth,
      contentHeight,
    },
    ratio: {
      x1,
      x2,
      y1,
      y2,
    },
    p: p,
    clone: () => {
      const newFontData = {
        rect: {
          width: fontWidth,
          height: FONT_HEIGHT,
          contentWidth,
          contentHeight,
        },
        ratio: {
          x1,
          x2,
          y1,
          y2,
        },
        p: p.slice(),
      };
      return newFontData;
    },
  };
}

function setCenter(
  arr: TypoPathData[],
  contentWidth: number,
  contentHeight: number,
) {
  const centerX = contentWidth / 2; // 중앙 x 좌표
  const centerY = contentHeight / 2; // 중앙 y 좌표

  // 중앙 좌표가 0, 0이 되도록 좌표를 이동
  return arr.map((data) => {
    data[1] -= centerX;
    data[2] -= centerY;
    if (data[0] === BEZIER_COMMAND) {
      data[3] -= centerX;
      data[4] -= centerY;
      data[5] -= centerX;
      data[6] -= centerY;
    }
    return new Vector(data);
  });
}

/**
 * 두 점이 x축에 대해 이루는 각도를 구한다.
 * @param x1 첫 번째 점의 x 좌표
 * @param y1 첫 번째 점의 y 좌표
 * @param x2 두 번째 점의 x 좌표
 * @param y2 두 번째 점의 y 좌표
 * @returns
 */
export function getRotation(x1: number, y1: number, x2: number, y2: number) {
  const x = x1 - x2;
  const y = y1 - y2;
  return -Math.atan2(x, y);
}

export function getCurveR(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
  t: number,
) {
  const x = partialBezierTangent(x1, x2, x3, x4, t);
  const y = partialBezierTangent(y1, y2, y3, y4, t);
  return -Math.atan2(x, y);
}
