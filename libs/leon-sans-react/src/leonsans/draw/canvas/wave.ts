import { PI2 } from '../../core/constants.js';
import { Point } from '../../core/point.js';
import { getAmplitude } from '../../core/util.js';

const THIN_LIMIT = 110;
const COS = Math.cos;
const SIN = Math.sin;

export function Wave(
  ctx: CanvasRenderingContext2D,
  data: ModelData,
  scale: number,
  amplitude: number,
  weight: number,
  fps: boolean,
) {
  const m_amplitude = getAmplitude(amplitude, scale);
  const saveDot: Point[] = [];
  ctx.beginPath();
  data.wavePaths?.reduce((prev, p) => {
    if (fps) {
      const ranx = Math.random() * m_amplitude - m_amplitude / 2;
      const rany = Math.random() * m_amplitude - m_amplitude / 2;
      p.rx = p.x + ranx * COS(p.rotation!);
      p.ry = p.y + ranx * SIN(p.rotation!);
      p.sx = p.x + ranx;
      p.sy = p.y + rany;
    }

    if (p.type == 'a') {
      saveDot.push(p);
    } else if (p.start == 1) {
      ctx.moveTo(p.x, p.y);
    } else if (p.fixed) {
      ctx.lineTo(p.x, p.y);
    } else {
      if (weight < THIN_LIMIT) {
        if (prev) {
          const qx = prev.x + (p.x - prev.x) * 0.5;
          const qy = prev.y + (p.y - prev.y) * 0.5;
          ctx.quadraticCurveTo(qx, qy, p.rx!, p.ry!);
        }
      } else {
        ctx.lineTo(p.rx!, p.ry!);
      }
    }
    return p;
  });
  ctx.stroke();

  saveDot.map((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius!, 0, PI2);
    ctx.fill();
  });
}
