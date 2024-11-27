import { ThemeType } from '.';
import { overlayStyles } from '../element-selector.styles';

export const updateOverlayStyle = (
  overlay: HTMLElement,
  currentTheme: ThemeType,
  styleSheet: HTMLStyleElement | null,
): HTMLStyleElement => {
  // 기존 스타일시트 제거
  if (styleSheet && document.head.contains(styleSheet)) {
    document.head.removeChild(styleSheet);
  }

  const theme = overlayStyles.themes[currentTheme];

  // 새 스타일시트 생성 및 적용
  const newStyleSheet = document.createElement('style');
  newStyleSheet.textContent = theme.keyframes;
  document.head.appendChild(newStyleSheet);

  // 오버레이에 스타일 적용
  overlay.style.cssText = overlayStyles.base + theme.style;
  overlay.style.animation = 'pulse 2s infinite';

  return newStyleSheet;
};
