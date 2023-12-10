import { Model } from './model';
import { Vector } from './vector';

/**
 * 주어진 모델 데이터의 각 path들에 포함된 라인들과
 *
 * @param data - The model data.
 * @param model - The model.
 * @returns An object containing the maximum length, an array of lines for each path, and an array of lengths for each path.
 */
export function getLengths(
  data: Pick<ModelData, 'range' | 'center' | 'typo'>,
  model: Model,
): LinesLengths {
  const linesArray: LineData[][] = [];
  const lengths: number[] = [];
  let max = 0;

  for (const path of data.typo.p) {
    const c = getEachPath(data, path.v, model);
    linesArray.push(c.lines);
    lengths.push(c.length);
    max += c.length;
  }

  return {
    max,
    linesArray,
    lengths,
  };
}

/**
 * points들이 이루고 있는 직선 또는 베지어 곡선들과 그들의 길이의 합을 구합니다.
 * @param data 모델 데이터
 * @param points 점들의 배열
 * @param model 점델
 * @returns 선들과 그들의 길이의 합
 */
function getEachPath(
  data: Pick<ModelData, 'range' | 'center'>,
  points: Vector[],
  model: Model,
) {
  const lines: LineData[] = [];
  let length = 0;

  points.reduce<Vector | null>((prevVector, curVector) => {
    const line: Partial<LineData> = {};
    const curPoint = curVector.convert(data, model);

    if (!prevVector || curVector.type == 'a') {
      line.x1 = curPoint.x;
      line.y1 = curPoint.y;
      line.distance = 0;
      line.radius = curPoint.radius;
    } else {
      const prevPoint = prevVector.convert(data, model);

      if (prevVector.type == 'b') {
        line.x1 = prevPoint.x3;
        line.y1 = prevPoint.y3;
      } else {
        line.x1 = prevPoint.x;
        line.y1 = prevPoint.y;
      }

      line.x2 = curPoint.x;
      line.y2 = curPoint.y;

      if (curVector.type == 'b') {
        const bezierCurve = line as BezierCurveData;
        bezierCurve.x3 = curPoint.x2!;
        bezierCurve.y3 = curPoint.y2!;
        bezierCurve.x4 = curPoint.x3!;
        bezierCurve.y4 = curPoint.y3!;
        bezierCurve.distance = cubicBezierLength(
          bezierCurve.x1,
          bezierCurve.y1,
          bezierCurve.x2,
          bezierCurve.y2,
          bezierCurve.x3,
          bezierCurve.y3,
          bezierCurve.x4,
          bezierCurve.y4,
        );
      } else {
        const simpleLine = line as SimpleLineData;
        line.distance = distance(
          simpleLine.x1,
          simpleLine.y1,
          simpleLine.x2,
          simpleLine.y2,
        );
      }
    }

    line.type = curVector.type;
    line.rotation = curVector.ratio.r;
    line.hide = curVector.ratio.h;
    line.fixed = curVector.ratio.f;
    line.vertex = curVector.ratio.v;

    lines.push(line as LineData);
    length += line.distance!;

    return curVector;
  }, null);

  return {
    lines,
    length,
  };
}

/**
 * cubic bezier curve를 sampleCount개의 선분으로 나누어 길이를 구합니다.
 * ![figure](https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Cubic_B%C3%A9zier_Curve.svg/2048px-Cubic_B%C3%A9zier_Curve.svg.png)
 * @param p0x 시작점의 x 좌표
 * @param p0y 시작점의 y 좌표
 * @param p1x 시작점의 제어점의 x 좌표
 * @param p1y 시작점의 제어점의 y 좌표
 * @param p2x 끝점의 제어점의 x 좌표
 * @param p2y 끝점의 제어점의 y 좌표
 * @param p3x 끝점의 x 좌표
 * @param p3y 끝점의 y 좌표
 * @param sampleCount 샘플링할 점의 개수
 * @returns cubic bezier curve 의 길이
 */
export function cubicBezierLength(
  p0x: number,
  p0y: number,
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
  p3x: number,
  p3y: number,
  sampleCount?: number,
) {
  const ptCount = sampleCount || 40;
  let totDist = 0;
  let lastX = p0x;
  let lastY = p0y;
  let dx, dy, i, pt;
  for (i = 1; i < ptCount; i++) {
    pt = cubicQxy(i / ptCount, p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);
    dx = pt.x - lastX;
    dy = pt.y - lastY;
    totDist += Math.sqrt(dx * dx + dy * dy);
    lastX = pt.x;
    lastY = pt.y;
  }
  dx = p3x - lastX;
  dy = p3y - lastY;
  totDist += Math.sqrt(dx * dx + dy * dy);
  return totDist;
}

/**
 * cubic bezier curve 위의 점의 좌표를 구합니다.
 * 점의 좌표는 t에 따라서 곡선의 시작 부분부터 끝 부분까지의 길이의 비율에 따라서 결정됩니다.
 * ![figure](https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Cubic_B%C3%A9zier_Curve.svg/2048px-Cubic_B%C3%A9zier_Curve.svg.png)
 * @param t 0 ~ 1 사이의 값
 * @param p0x 시작점의 x 좌표
 * @param p0y 시작점의 y 좌표
 * @param p1x 시작점의 제어점의 x 좌표
 * @param p1y 시작점의 제어점의 y 좌표
 * @param p2x 끝점의 제어점의 x 좌표
 * @param p2y 끝점의 제어점의 y 좌표
 * @param p3x 끝점의 x 좌표
 * @param p3y 끝점의 y 좌표
 * @returns
 */
function cubicQxy(
  t: number,
  p0x: number,
  p0y: number,
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
  p3x: number,
  p3y: number,
) {
  const p4x = p0x + (p1x - p0x) * t;
  const p4y = p0y + (p1y - p0y) * t;

  const p5x = p1x + (p2x - p1x) * t;
  const p5y = p1y + (p2y - p1y) * t;

  const p6x = p2x + (p3x - p2x) * t;
  const p6y = p2y + (p3y - p2y) * t;

  const p7x = p4x + (p5x - p4x) * t;
  const p7y = p4y + (p5y - p4y) * t;

  const p8x = p5x + (p6x - p5x) * t;
  const p8y = p5y + (p6y - p5y) * t;

  const p9x = p7x + (p8x - p7x) * t;
  const p9y = p7y + (p8y - p7y) * t;
  return {
    x: p9x,
    y: p9y,
  };
}

/**
 * point1 과 point2 사이의 거리를 구합니다.
 * @param x1 point1의 x 좌표
 * @param y1 point1의 y 좌표
 * @param x2 point2의 x 좌표
 * @param y2 point2의 y 좌표
 * @returns point1 과 point2 사이의 거리
 */
export function distance(x1: number, y1: number, x2: number, y2: number) {
  const a = x2 - x1,
    b = y2 - y1;
  return Math.sqrt(a * a + b * b);
}
