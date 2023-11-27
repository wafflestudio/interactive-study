import { bezierTangent } from '../core/paths.js';
import { Vector } from '../core/vector';
import { FONT_HEIGHT } from './constants';
import { CloneableFontData, Path, PathData, RawPathData } from './types';

export function generateFontData(
  w: number,
  fw: number,
  fh: number,
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
      v: setCenter(path[i].v, fw, fh),
    });
  }

  return {
    rect: {
      w: w,
      h: FONT_HEIGHT,
      fw: fw,
      fh: fh,
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
          w: w,
          h: FONT_HEIGHT,
          fw: fw,
          fh: fh,
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

function setCenter(arr: Path[], fw: number, fh: number) {
  const total = arr.length;
  const cx = fw / 2;
  const cy = fh / 2;
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
