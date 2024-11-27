export const cleanupOverlayElement = (
  styleSheet: HTMLStyleElement | null,
  overlay: HTMLElement | null,
): void => {
  if (styleSheet && document.head.contains(styleSheet)) {
    document.head.removeChild(styleSheet);
  }

  if (overlay && document.body.contains(overlay)) {
    document.body.removeChild(overlay);
  }
};
