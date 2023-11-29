import { bezierTangent } from '../core/paths.js';
import { Vector } from '../core/vector';

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
  path: RawPathData[],
): CloneableFontData {
  const arr: PathData[] = [];
  const total = path.length;
  let i;
  for (i = 0; i < total; i++) {
    arr.push({
      d: path[i].d,
      v: setCenter(path[i].v, contentWidth, contentHeight),
    });
  }

  return {
    rect: {
      width: fontWidth,
      height: FONT_HEIGHT,
      contentWidth,
      contentHeight,
    },
    ratio: {
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
    },
    p: arr,
    clone: () => {
      const arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        arr2[i] = {
          d: arr[i].d,
          v: arr[i].v,
        };
      }
      const v = {
        rect: {
          width: fontWidth,
          height: FONT_HEIGHT,
          contentWidth,
          contentHeight,
        },
        ratio: {
          x1: x1,
          x2: x2,
          y1: y1,
          y2: y2,
        },
        p: arr2,
      };
      return v;
    },
  };
}

function setCenter(arr: Path[], contentWidth: number, contentHeight: number) {
  const total = arr.length;
  const cx = contentWidth / 2;
  const cy = contentHeight / 2;
  let ct = [];

  for (let i = 0; i < total; i++) {
    const mp: Path = arr[i];
    mp[1] -= cx;
    mp[2] -= cy;
    if (mp[0] == 'b') {
      mp[3] -= cx;
      mp[4] -= cy;
      mp[5] -= cx;
      mp[6] -= cy;
    }
    ct.push(new Vector(mp));
  }

  return ct;
}

export function getR(x1: number, y1: number, x2: number, y2: number) {
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
  const x = bezierTangent(x1, x2, x3, x4, t);
  const y = bezierTangent(y1, y2, y3, y4, t);
  return -Math.atan2(x, y);
}
