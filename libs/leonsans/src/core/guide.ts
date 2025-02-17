import { Typo } from '../font/types';
import { RECT_RATIO } from './constants';
import { GuidePosition } from './types';

/**
 * @name getGuide
 * @param d - typo data object from 'font/index.js'
 * @param scale
 * @returns {Object} the guide pos array
 * @description get a guide pos
 */
export function getGuide(d: Typo, scale: number): GuidePosition[] {
  const guide: GuidePosition[] = [];
  const ggap = 10;

  for (let i = 0; i < 6; i++) {
    const gvx = ggap * i + 20;
    const gvy = ggap * i + 90;
    guide[i] = {
      x1: gvx * RECT_RATIO * scale,
      x2: (d.rect.width - gvx * 2) * RECT_RATIO * scale,
      y1: gvy * RECT_RATIO * scale,
      y2:
        (d.rect.height - gvy) * RECT_RATIO * scale -
        i * ggap * RECT_RATIO * scale,
    };
  }

  return guide;
}

/**
 * @name getGuide
 * @property {Object} - typo data object from 'font/index.js'
 * @property {Number} - scale
 * @returns {Object} the guide pos array
 * @description get a guide pos
 */
// @ts-ignore
export function getGrid(d: Typo, scale: number): number[] {
  const grid = [],
    gvy = [98, 340, 815];
  for (let i = 0; i < 3; i++) {
    grid[i] = gvy[i] * RECT_RATIO * scale;
  }

  return grid;
}
