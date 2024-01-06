import { PI2 } from '../../core/constants.js';
import { cubicBezierLength, distance } from '../../core/length.js';
import { Model } from '../../core/model.js';
import { ModelData, ModelDataLine, Position } from '../../core/types.js';
import { getCurrent } from '../../core/util.js';

let colorArr: string[];
let curColor = -1;
let colorTotal: number;
const MIN_DISTANCE = 10;

export function Colorful(
  ctx: CanvasRenderingContext2D,
  model: Model,
  colors: string[],
) {
  curColor = -1;
  colorArr = colors;
  colorTotal = colorArr.length;
  const total = model.data.length;
  let i, d, j, j_total, line, pos, prev: Position | null;
  let max, length, prevRatio;
  for (i = 0; i < total; i++) {
    d = model.data[i];
    max = d.pointsLength.max;
    prevRatio = 0;
    j_total = d.lines.length;
    prev = null;
    for (j = 0; j < j_total; j++) {
      line = d.lines[j];
      pos = line.pos;
      if (pos.type == 'a') {
        setColor(ctx);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.radius! * d.drawing.value, 0, PI2);
        ctx.fill();
        ctx.closePath();
      } else if (pos.type == 'm') {
        prev = pos;
      } else if (pos.type == 'l') {
        length = distance(prev!.x, prev!.y, pos.x, pos.y);
        if (length / model.scale > MIN_DISTANCE) {
          // ignore short distance paths
          setColor(ctx);
          ctx.beginPath();
          if (prev) ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(pos.x, pos.y);
          prevRatio += draw(ctx, line, length, max, d, prevRatio);
        }
        prev = pos;
      } else if (pos.type == 'b') {
        length = cubicBezierLength(
          prev!.x,
          prev!.y,
          pos.x,
          pos.y,
          pos.x2!,
          pos.y2!,
          pos.x3!,
          pos.y3!,
        );
        if (length / model.scale > MIN_DISTANCE) {
          setColor(ctx);
          ctx.beginPath();
          if (prev) ctx.moveTo(prev.x, prev.y);
          ctx.bezierCurveTo(pos.x, pos.y, pos.x2!, pos.y2!, pos.x3!, pos.y3!);
          prevRatio += draw(ctx, line, length, max, d, prevRatio);
        }
        prev = {
          x: pos.x3!,
          y: pos.y3!,
        };
      }
    }
  }
}

function setColor(ctx: CanvasRenderingContext2D) {
  const color = getColor();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
}

function getColor() {
  curColor++;
  if (curColor == colorTotal) curColor = 0;
  return colorArr[curColor];
}

function draw(
  ctx: CanvasRenderingContext2D,
  line: ModelDataLine,
  length: number,
  max: number,
  d: Pick<ModelData, 'drawing'>,
  prevRatio: number,
) {
  const ltRatio = length / max;
  let dv = getCurrent(d.drawing.value, prevRatio + ltRatio, prevRatio, 1, 0);
  if (line.direction == 1) {
    dv = getCurrent(1 - d.drawing.value, prevRatio, prevRatio + ltRatio, 1, 0);
  }
  if (dv > 0) {
    const frac = length * dv;
    ctx.setLineDash([length]);
    ctx.lineDashOffset = line.direction * (frac + length);
    ctx.stroke();
  }
  return ltRatio;
}
