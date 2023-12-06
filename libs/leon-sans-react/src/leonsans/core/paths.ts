import { ROTATE_NONE } from '../font/constants';
import { Model } from './model';
import { Point } from './point';
import { getCurrent } from './util';

type Curve = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  x4: number;
  y4: number;
};

/**
 * TODO get a guide pos
 * @name getPaths
 * @param model Model object
 * @param data ModelData object
 * @param pathGap gap between paths
 * @param isPattern whether it's a pattern or not
 * @returns Returns paths array
 */
export function getPaths(
  model: Model,
  data: ModelData,
  pathGap: number,
  isPattern: boolean,
): Point[] {
  return data
    .pointsLength!.linesArray.map((lines) => {
      return getDotPos(lines, pathGap, model.scale);
    })
    .flatMap((lineGroup, i) => {
      const paths: Point[] = isPattern
        ? lineGroup.filter((line) => line.rotation != ROTATE_NONE && !line.hide)
        : lineGroup.filter((line) => line.rotation != ROTATE_NONE);

      const direction = data.typo.p[i].d;
      if (direction == 1) {
        paths.reverse();
      }

      if (paths.length > 0) {
        paths[0].start = 1;
      }
      return paths;
    }, [] as Point[]);
}

/**
 * TODO
 * @param lines
 * @param pathGap
 * @param scale
 * @returns
 */
function getDotPos(lines: LineData[], pathGap: number, scale: number): Point[] {
  const arr: Point[] = [];
  const pgap = pathGap > -1 ? getCurrent(pathGap, 1, 0, 80, 10) * scale : 1;
  let isFirst = true;

  lines.reduce<Point | null>((prevPoint, line) => {
    let curPoint: Point | null = null;
    if (line.type == 'a') {
      arr.push(
        new Point({
          x: line.x1,
          y: line.y1,
          rotation: 0,
          type: 'a',
          hide: line.hide,
          fixed: line.fixed,
          radius: line.radius,
        }),
      );
    } else if (line.distance == 0) {
      // it should be type m
      curPoint = new Point({
        x: line.x1,
        y: line.y1,
        rotation: line.rotation,
        type: line.type,
        hide: line.hide,
        fixed: line.fixed,
      });
      curPoint = setPointValues(curPoint, prevPoint, line, 1);
      if (curPoint != null) {
        if (isFirst) {
          curPoint.type = 'm';
          isFirst = false;
        }
        arr.push(curPoint);
      }
    } else {
      let numOfPoints = Math.ceil(line.distance / pgap);

      if (line.vertex) numOfPoints = 2;
      else if (numOfPoints < 3) numOfPoints = 3;

      for (let j = 1; j < numOfPoints; j++) {
        const vertexScore = j / (numOfPoints - 1);
        if (line.type == 'b') {
          curPoint = getCubicBezierXYatT(line, vertexScore);
        } else {
          curPoint = new Point({
            x: line.x1 + (line.x2 - line.x1) * vertexScore,
            y: line.y1 + (line.y2 - line.y1) * vertexScore,
            type: line.type,
          });
        }

        if (line.rotation != 0 && vertexScore == 1)
          curPoint.rotation = line.rotation;

        if (line.hide && vertexScore == 1) curPoint.hide = line.hide;

        if (line.fixed && vertexScore == 1) curPoint.fixed = line.fixed;

        if (numOfPoints > 0) {
          curPoint = setPointValues(
            curPoint,
            prevPoint,
            line,
            vertexScore === 1 ? 1 : 0,
          );
          if (curPoint != null) {
            if (isFirst) {
              curPoint.type = 'm';
              isFirst = false;
            }
            arr.push(curPoint);
          }
        }
      }
    }
    return curPoint;
  }, null);

  return arr;
}

/**
 * Set the distance, rotation, and type of the point.
 * @param cur current point
 * @param prev previous point
 * @param line line data
 * @param vertex if the point is a vertex, the value is 1
 * @returns current point {@link cur} or null if the point is not a vertex
 */
function setPointValues(
  cur: Point,
  prev: Point | null,
  line: LineData,
  vertex: 1 | 0,
): Point | null {
  const pp = new Point(cur);
  pp.type = line.type;
  pp.distance = line.distance;
  pp.vertex = vertex;

  if (prev && pp.rotation === null) {
    const dx = pp.x - prev.x;
    const dy = pp.y - prev.y;
    pp.rotation = -Math.atan2(dx, dy); // prev -> cur 로의 기울기
  }

  if (pp.rotation == ROTATE_NONE) {
    return null;
  } else {
    return pp;
  }
}

/**
 * Calculate the position and rotation of the bezier curve at interval {@link t}
 * @param curve bezier curve
 * @param t an interval between 0 and 1
 * @returns
 */
function getCubicBezierXYatT(curve: Curve, t: number) {
  const x = partialBezier(curve.x1, curve.x2, curve.x3, curve.x4, t);
  const y = partialBezier(curve.y1, curve.y2, curve.y3, curve.y4, t);
  const rotation = getCubicBezierTangent(curve, t);

  return new Point({
    x: x,
    y: y,
    rotation: rotation,
  });
}

/**
 * Calculate the position on the bezier curve at interval {@link t}
 * @param s start point of the curve
 * @param c1 first control point
 * @param c2 second control point
 * @param e end point of the curve
 * @param t an interval between 0 and 1
 * @returns
 */
function partialBezier(
  s: number,
  c1: number,
  c2: number,
  e: number,
  t: number,
) {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    s +
    (-s * 3 + t * (3 * s - s * t)) * t +
    (3 * c1 + t * (-6 * c1 + c1 * 3 * t)) * t +
    (c2 * 3 - c2 * 3 * t) * t2 +
    e * t3
  );
}

/**
 * Calculate the tangent of the bezier curve at interval {@link t}
 * @param curve bezier curve
 * @param t an interval between 0 and 1
 * @returns
 */
export function getCubicBezierTangent(curve: Curve, t: number) {
  const dx_dt = partialBezierTangent(curve.x1, curve.x2, curve.x3, curve.x4, t);
  const dy_dt = partialBezierTangent(curve.y1, curve.y2, curve.y3, curve.y4, t);
  return -Math.atan2(dx_dt, dy_dt);
}

/**
 * Partial differential of bezier curve at interval {@link t}
 * It is used to calculate the rotation of the bezier curve.
 * https://stackoverflow.com/questions/32322966/quadratic-curve-with-rope-pattern
 * https://math.stackexchange.com/questions/2417451/tangent-to-a-bezier-cubic-curve
 * @param s start point of the curve
 * @param c1 first control point
 * @param c2 second control point
 * @param e end point of the curve
 * @param t an interval between 0 and 1
 * @returns
 */
export function partialBezierTangent(
  s: number,
  c1: number,
  c2: number,
  e: number,
  t: number,
) {
  const t2 = t * t;
  return (
    3 * t2 * (-s + 3 * c1 - 3 * c2 + e) +
    6 * t * (s - 2 * c1 + c2) +
    3 * (-s + c1)
  );
}
