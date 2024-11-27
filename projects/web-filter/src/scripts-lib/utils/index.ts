import { overlayStyles } from '../element-selector.styles';
import { cleanupOverlayElement } from './cleanup-overlay-element';
import { createOverlayElement } from './create-overlay-element';
import { getThemeColor } from './get-theme-color';
import { highlightElement } from './hightlight-element';
import { updateOverlayStyle } from './update-overlay-style';

export type ThemeType = keyof typeof overlayStyles.themes;

export {
  createOverlayElement,
  cleanupOverlayElement,
  highlightElement,
  updateOverlayStyle,
  getThemeColor,
};
