import { Model } from './model';
import { Vector } from './vector';

/**
 * 주어진 모델 데이터의 각 path들에 포함된 라인들과
 *
 * @param data - The model data.
 * @param model - The model.
 * @returns An object containing the maximum length, an array of lines for each path, and an array of lengths for each path.
 */
export function getLengths(data: ModelData, model: Model): LinesLengths {
  let c,
    linesArray = [],
    lengths = [],
    max = 0;
  for (const path of data.typo.p) {
    c = getEachPath(data, path.v, model);
    max += c.length;
    linesArray.push(c.lines);
    lengths.push(c.length);
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
function getEachPath(data: ModelData, points: Vector[], model: Model) {
  let lines: LineData[] = [];
  let length = 0;
  let prev: Vector | undefined;

  for (const _point of points) {
    const line: Partial<LineData> = {};
    const point = _point.convert(data, model);

    if (prev === undefined || _point.type == 'a') {
      line.x1 = point.x;
      line.y1 = point.y;
      line.distance = 0;
      line.radius = point.radius;
    } else {
      const prevPoint = prev.convert(data, model);

      if (prev.type == 'b') {
        line.x1 = prevPoint.x3;
        line.y1 = prevPoint.y3;
      } else {
        line.x1 = prevPoint.x;
        line.y1 = prevPoint.y;
      }

      line.x2 = point.x;
      line.y2 = point.y;

      if (_point.type == 'b') {
        line.x3 = point.x2;
        line.y3 = point.y2;
        line.x4 = point.x3;
        line.y4 = point.y3;
        line.distance = cubicBezierLength(
          line.x1!,
          line.y1!,
          line.x2,
          line.y2,
          line.x3!,
          line.y3!,
          line.x4!,
          line.y4!,
        );
      } else {
        line.distance = distance(line.x1!, line.y1!, line.x2, line.y2);
      }
    }

    line.type = _point.type;
    line.rotation = _point.ratio.r;
    line.pat = _point.ratio.p;
    line.fix = _point.ratio.f;
    line.vt = _point.ratio.v;

    lines.push(line as LineData);
    length += line.distance;

    prev = _point;
  }

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
