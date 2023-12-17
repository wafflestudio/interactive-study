import { PI2 } from '../../core/constants.js';
import { Point } from '../../core/point.js';
import { ModelData } from '../../core/types.js';
import { getAmplitude } from '../../core/util.js';

const THIN_LIMIT = 110;
const COS = Math.cos;
const SIN = Math.sin;

export function Wave(
  ctx: CanvasRenderingContext2D,
  data: Pick<ModelData, 'wavePaths'>,
  scale: number,
  amplitude: number,
  weight: number,
  updatePath: boolean,
) {
  const m_amplitude = getAmplitude(amplitude, scale);
  const saveDot: Point[] = [];
  ctx.beginPath();

  data.wavePaths.reduce<Point | null>((prev, cur) => {
    if (updatePath) {
      const ranx = Math.random() * m_amplitude - m_amplitude / 2;
      const rany = Math.random() * m_amplitude - m_amplitude / 2;
      cur.rx = cur.x + ranx * COS(cur.rotation!);
      cur.ry = cur.y + ranx * SIN(cur.rotation!);
      cur.sx = cur.x + ranx;
      cur.sy = cur.y + rany;
    }

    if (cur.type == 'a') {
      saveDot.push(cur);
    } else if (cur.start == 1) {
      ctx.moveTo(cur.x, cur.y);
    } else if (cur.fixed) {
      ctx.lineTo(cur.x, cur.y);
    } else {
      if (weight < THIN_LIMIT) {
        if (prev) {
          const qx = prev.x + (cur.x - prev.x) * 0.5;
          const qy = prev.y + (cur.y - prev.y) * 0.5;
          ctx.quadraticCurveTo(qx, qy, cur.rx!, cur.ry!);
        }
      } else {
        ctx.lineTo(cur.rx!, cur.ry!);
      }
    }
    return cur;
  }, null);
  ctx.stroke();

  saveDot.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius!, 0, PI2);
    ctx.fill();
  });
}
