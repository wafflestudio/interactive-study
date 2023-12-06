export function Grids(ctx: CanvasRenderingContext2D, data: ModelData) {
  ctx.save();

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#aaaaaa';

  data.grid?.forEach((grid) => {
    ctx.moveTo(data.rect.x + grid, data.rect.y);
    ctx.lineTo(data.rect.x + grid, data.rect.y + data.rect.h);
  });
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.strokeStyle = '#aaaaaa';
  ctx.rect(data.rect.x, data.rect.y, data.rect.w, data.rect.h);
  ctx.stroke();

  ctx.restore();
}
