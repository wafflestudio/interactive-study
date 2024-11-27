export const highlightElement = (overlay: HTMLElement): void => {
  overlay.style.transform = 'scale(1.01)';
  setTimeout(() => (overlay.style.transform = 'scale(1)'), 300);
};
