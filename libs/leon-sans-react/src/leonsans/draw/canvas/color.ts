export function Color(
  ctx: CanvasRenderingContext2D,
  index: number, // 몇 번째 데이터?
  data: Pick<ModelData, 'rect'>,
  colorSet: (string | string[])[],
) {
  let c_total = colorSet.length;
  const currentIndex =
    (index + c_total * (Math.abs((index / 10) | 0) + 1)) % c_total;
  const currentColor = colorSet[currentIndex];
  if (Array.isArray(currentColor)) {
    c_total = currentColor.length;
    const vv = 1 / (c_total + 1);
    const g = ctx.createLinearGradient(
      data.rect.x,
      data.rect.y,
      data.rect.x,
      data.rect.y + data.rect.h,
    );
    let i;
    g.addColorStop(vv, currentColor[0]);
    for (i = 0; i < c_total; i++) {
      g.addColorStop(vv * (i + 1), currentColor[i]);
    }
    g.addColorStop(vv * (c_total + 1), currentColor[c_total - 1]);
    ctx.strokeStyle = g;
    ctx.fillStyle = g;
  } else {
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
  }
}
