import { OVERLAY_ID } from '../constants/id';
import { removeOverlayCanvas } from './removeOverlayCanvas';

export const clearOverlayCanvas = ({
  canvasId,
  animationFrame,
}: {
  canvasId?: string;
  animationFrame?: number;
}) => {
  const canvas = document.getElementById(
    OVERLAY_ID,
  ) as HTMLCanvasElement | null; // TODO: ref로 잡자

  const ctx = canvas?.getContext('2d');

  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  removeOverlayCanvas({ canvasId });
};
