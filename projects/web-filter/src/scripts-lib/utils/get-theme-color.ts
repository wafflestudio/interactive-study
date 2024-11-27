import { ThemeType } from '.';

export const getThemeColor = (currentTheme: ThemeType): string => {
  switch (currentTheme) {
    case 'pastel':
      return 'rgba(255, 182, 193, 0.5)';
    case 'neon':
      return '#00ff00';
    case 'minimal':
      return 'rgba(0, 0, 0, 0.2)';
    default:
      return 'rgba(62, 184, 255, 0.5)';
  }
};
