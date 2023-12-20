import { char } from '../core/types';
import { TOFU } from './constants';
import { LATIN } from './latin';
import { LOWER } from './lower';
import { NUMBER } from './number';
import { SPECIAL } from './special';
import { Typo } from './types';
import { UPPER } from './upper';

const TYPO_DATA: Record<char, Typo> = {
  ...UPPER,
  ...LOWER,
  ...NUMBER,
  ...SPECIAL,
  ...LATIN,
};

export const CHARSET = Object.keys(TYPO_DATA);

/**
 * 문자(길이가 1인 string)를 받아 해당 문자에 맞는 Typo 객체를 반환합니다.
 * 적절한 객체가 없을 경우, 폴백으로 Tofu 객체를 반환합니다.
 * @param character 변환하고 싶은 문자
 * @returns 문자로 부터 변환된 객체
 */
export function getTypo(character: char): Typo {
  const originalFont = TYPO_DATA[character] ?? TYPO_DATA[TOFU];
  const clonedFont = originalFont.clone();
  clonedFont.character = character;
  return clonedFont;
}
