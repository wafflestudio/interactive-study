export function Lines(ctx: CanvasRenderingContext2D, data: ModelData) {
  data.lines?.forEach((line) => {
    const pos = line.pos;
    if (pos.type == 'a') {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.radius! * data.drawing!.value, 0, PI2);
      ctx.fill();
      ctx.closePath();
    } else if (pos.type == 'm') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    } else if (pos.type == 'l') {
      ctx.lineTo(pos.x, pos.y);
      line.stroke(ctx, line);
    } else if (pos.type == 'b') {
      ctx.bezierCurveTo(pos.x, pos.y, pos.x2!, pos.y2!, pos.x3!, pos.y3!);
      line.stroke(ctx, line);
    }
  });
}
