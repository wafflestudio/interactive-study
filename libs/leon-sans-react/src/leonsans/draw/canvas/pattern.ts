import { PI2 } from '../../core/constants';

export function Pattern(
  ctx: CanvasRenderingContext2D,
  data: Pick<ModelData, 'paths' | 'drawing'>,
  w: number,
  h: number,
) {
  data.paths
    ?.slice(0, Math.round(data.paths.length * data.drawing.value))
    .forEach((p) => {
      if (p.vertex == 1) {
        ctx.fillStyle = '#ff00c5';
      } else {
        ctx.fillStyle = '#ff95f8';
      }
      if (p.type == 'a') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, w / 3, 0, PI2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation!);
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.restore();
      }
    });
}
