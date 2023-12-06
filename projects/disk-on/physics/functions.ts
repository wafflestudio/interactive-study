import { MouseEventHandler } from 'react';

import { Coordinates } from './types';

/**
 * 숫자가 -1 ~ 1 사이면 퍼센트로 인식하여 계산하는 함수.
 * @param type 가로 또는 세로
 * @param value 0 ~ 1 사이의 값
 * @returns
 */
export const parsePositionIfPercent = (
  value: number,
  type: 'horizontal' | 'vertical' = 'horizontal',
): number => {
  if (typeof window === 'undefined') return value;
  if (value > 1 || value < -1) return value;
  return type === 'horizontal'
    ? window.innerWidth * value
    : window.innerHeight * value;
};

export const parseCoordinatesIfPercent = ({
  x,
  y,
}: Coordinates): Coordinates => ({
  x: parsePositionIfPercent(x),
  y: parsePositionIfPercent(y, 'vertical'),
});

export const pivotCoordinate = (
  { x, y }: Coordinates,
  size: number,
  pivotPoint: 'center' | 'leftTop' | 'rightTop' | Coordinates = 'leftTop',
): Coordinates => {
  switch (pivotPoint) {
    case 'center':
      return {
        x: x - size / 2,
        y: y - size / 2,
      };
    case 'leftTop':
      return {
        x,
        y,
      };
    case 'rightTop':
      return {
        x: x - size,
        y: y,
      };
    default:
      const { x: pivotX, y: pivotY } = pivotPoint;
      return {
        x: x - pivotX,
        y: y - pivotY,
      };
  }
};

const getXAndYFromParent = (
  rect: DOMRect,
  { x, y }: { x: number; y: number },
): Coordinates => {
  return {
    x: x - rect.left,
    y: y - rect.top,
  };
};

export const getXAndYFromMouseEvent = (
  e: Parameters<MouseEventHandler<HTMLDivElement>>[0],
  type: 'root' | 'parent' = 'root',
): Coordinates => {
  switch (type) {
    case 'root':
      return {
        x: e.clientX,
        y: e.clientY,
      };
    case 'parent':
      if (e.currentTarget instanceof HTMLElement)
        return getXAndYFromParent(e.currentTarget?.getBoundingClientRect(), {
          x: e.clientX,
          y: e.clientY,
        });
      return { x: e.clientX, y: e.clientY };
  }
};
