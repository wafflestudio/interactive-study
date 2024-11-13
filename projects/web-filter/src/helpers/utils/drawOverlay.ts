import { createOverlayCanvas } from './createOverlayCanvas';

export const drawOverlay = ({
  targetElement,
  animationFrame,
  canvasId,
  existingCanvas,
}: {
  targetElement: HTMLElement | null;
  animationFrame?: number;
  canvasId?: string;
  existingCanvas?: HTMLCanvasElement;
}) => {
  const canvas = createOverlayCanvas({ canvasId, existingCanvas }); // TODO: ref로 잡자
  const ctx = canvas.getContext('2d');

  if (!ctx || !canvas || !targetElement) return;

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const rect = targetElement.getBoundingClientRect();

  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  ctx.strokeStyle = 'rgba(65, 145, 255, 0.9)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);

  const animationState = { dashOffset: 0 };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineDashOffset = animationState.dashOffset;
    animationState.dashOffset -= 0.5;

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

    animationFrame = requestAnimationFrame(animate);
  };

  animate();
};
