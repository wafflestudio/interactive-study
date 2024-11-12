// TODO: refactor
export const createOverlayCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.id = 'element-selection-overlay';
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '999999',
    transition: 'opacity 0.2s ease-in-out',
  });
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  return canvas;
};

export const drawOverlay = (
  ctx: CanvasRenderingContext2D | null,
  canvas: HTMLCanvasElement,
  element: HTMLElement | null,
  animationFrameRef: React.MutableRefObject<number | undefined>,
) => {
  if (!ctx || !canvas || !element) return;

  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const rect = element.getBoundingClientRect();

  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  ctx.strokeStyle = 'rgba(65, 145, 255, 0.9)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);

  let dashOffset = 0;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineDashOffset = dashOffset;
    dashOffset -= 0.5;

    ctx.beginPath();
    ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);

    const gradient = ctx.createLinearGradient(
      rect.left,
      rect.top,
      rect.left,
      rect.bottom,
    );
    gradient.addColorStop(0, 'rgba(65, 145, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(65, 145, 255, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(rect.left, rect.top, rect.width, rect.height);

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  animate();
};
