import { typo } from '../font/index.js';
import { getRect } from './util.js';

/**
 * 먼저 전체 문자열(text)을 명시적인 줄바꿈 문자('\n')로 나누고, 크기(scale)과 너비(width)를
 * 고려하여 추가적인 줄바꿈을 수행한 뒤, 각 줄의 문자열(string)을 문자(char) 배열로 변환한
 * 배열을 반환합니다.
 * @param text 전체 문자열
 * @param scale 문자열의 크기
 * @param width 줄바꿈의 기준이 되는 너비
 * @param isBreakAll 단어 중간에서 줄바꿈을 허용할지 여부
 * @returns 각 줄의 문자열(string)을 문자(char) 배열로 변환한 배열
 */
export function getTextGroup(
  text: string,
  scale: number,
  width: number,
  isBreakAll: boolean,
): char[][] {
  let group: string[];
  if (text.indexOf('\n') > 0) {
    group = text.split('\n');
  } else if (text.indexOf('\\n') > 0) {
    group = text.split('\\n');
  } else {
    group = [text];
  }
  if (width == 0) return keepAll(group);
  else if (isBreakAll) return breakAll(group, scale, width);
  else return breakWord(group, scale, width);
}

/**
 * 너비를 무시하고 명시적인 줄바꿈으로만 나누어진 문자열(string)을 문자(char) 배열로 변환한
 * 배열을 반환합니다.
 * @param group 명시적인 줄바꿈으로 쪼개진 문자열(string) 배열
 * @returns 각 줄의 문자열(string)을 문자(char) 배열로 변환한 배열
 */
function keepAll(group: string[]): char[][] {
  const textGroup: char[][] = [];
  const total = group.length;
  for (let i = 0; i < total; i++) {
    textGroup[i] = group[i].split('');
  }
  return textGroup;
}

/**
 * 너비를 고려하되, 단어 중간에는 줄바꿈을 수행하지 않는 문자열(string)을 문자(char) 배열로
 * 변환한 배열을 반환합니다.
 * @param group 명시적인 줄바꿈으로 쪼개진 문자열(string) 배열
 * @param scale 문자열의 크기
 * @param width 줄바꿈의 기준이 되는 너비
 * @returns
 */
function breakWord(group: string[], scale: number, width: number): char[][] {
  let lineWidth: number = 0, // 현재 줄의 너비
    wordWidth: number = 0, // 현재 단어의 너비
    index: number = 0, // 실질적인 줄바꿈을 수행한 줄의 인덱스
    fontRect: Rect,
    fontData: FontData;
  const groupWithImplicitLineBreak: string[][] = []; // 실질적인 줄바꿈으로 쪼개진 문자열(string)을 단어(string)의 배열로 변환한 배열
  for (const line of group) {
    let wordGroup = line.split(' '); // 각 줄을 단어 단위로 쪼갬
    groupWithImplicitLineBreak[index] = []; // index 번째 줄의 문자들을 담을 배열
    for (const word of wordGroup) {
      wordWidth = 0;
      for (const character of word) {
        fontData = typo(character); // 문자를 FontData로 변환
        fontRect = getRect(fontData, scale); // 문자의 크기를 계산 (여기서 x, y는 의미없는 값)
        wordWidth += fontRect.w; // 문자의 너비를 누적
      }
      fontData = typo(' ');
      fontRect = getRect(fontData, scale);
      wordWidth += fontRect.w;
      lineWidth += wordWidth;

      // 현재 줄의 너비가 기준 너비를 초과하면 줄바꿈을 수행하고
      // 현재 줄의 너비를 현재 단어의 너비로 초기화한 뒤,
      // 현재 단어를 다음 줄의 첫 번째 단어로 추가
      if (lineWidth > width) {
        index += 1;
        lineWidth = wordWidth;
        groupWithImplicitLineBreak[index] = [];
      }
      groupWithImplicitLineBreak[index].push(word);
    }
    index += 1;
    lineWidth = 0;
  }

  // 암시적인 줄바꿈이 추가된 문자열(string) 그룹룹 문자(char) 배열의 그룹으로 변환
  const textGroup: char[][] = [];
  for (const line of groupWithImplicitLineBreak) {
    const t = line.join(' ').split('');
    if (t.length > 0) {
      textGroup.push(t);
    }
  }

  return textGroup;
}

/**
 * 너비를 고려하며, 단어 중간에서도 줄바꿈을 수행한 문자열(string)을 문자(char) 배열로 변환된
 * 배열을 반환합니다.
 * @param group 명시적인 줄바꿈으로 쪼개진 문자열(string) 배열
 * @param scale 문자열 크기
 * @param width 줄바꿈의 기준이 되는 너꿈
 * @returns
 */
function breakAll(group: string[], scale: number, width: number): char[][] {
  const textGroupWithoutTrimed: char[][] = [];

  for (const line of group) {
    let lineWidth = 0;
    let index = 0;
    textGroupWithoutTrimed[index] = [];
    for (const character of line) {
      const fontData = typo(character);
      const fontRect = getRect(fontData, scale);
      lineWidth += fontRect.w;
      textGroupWithoutTrimed[index].push(character);
      if (lineWidth >= width) {
        index += 1;
        lineWidth = fontRect.w;
        textGroupWithoutTrimed[index] = [];
      }
    }
    index += 1;
  }

  // 각 줄의 맨 처음, 맨 끝에 있는 공백을 하나씩만 제거하고
  // 비어있는 줄은 제거
  const textGroup = [];
  for (const text of textGroupWithoutTrimed) {
    if (text.length > 0) {
      if (text[0] == ' ') text.shift();
      if (text[text.length - 1] == ' ') text.pop();
      if (text.length > 0) textGroup.push(text);
    }
  }
  return textGroup;
}
