export const createOverlayElement = (overlayId: string): HTMLElement => {
  const overlay = document.createElement('div');
  overlay.id = overlayId;
  document.body.appendChild(overlay);
  return overlay;
};
