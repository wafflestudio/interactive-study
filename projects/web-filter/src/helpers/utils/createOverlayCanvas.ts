import { OVERLAY_ID } from '../constants/id';

export const createOverlayCanvas = ({
  canvasId,
  existingCanvas,
}: {
  canvasId?: string;
  existingCanvas?: HTMLCanvasElement;
}): HTMLCanvasElement => {
  if (existingCanvas) return existingCanvas;

  const canvas = document.createElement('canvas'); // TODO: ref로 잡자
  canvas.id = canvasId ?? OVERLAY_ID;

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
