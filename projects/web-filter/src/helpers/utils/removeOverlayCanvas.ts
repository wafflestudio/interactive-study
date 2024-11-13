import { OVERLAY_ID } from '../constants/id';

export const removeOverlayCanvas = ({
  canvasId = OVERLAY_ID,
}: {
  canvasId?: string;
}) => {
  const canvas = document.getElementById(canvasId); // TODO: ref로 잡자

  if (canvas && canvas.parentElement) {
    canvas.parentElement.removeChild(canvas);
  }
};
