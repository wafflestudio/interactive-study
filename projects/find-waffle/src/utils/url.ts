/**
 * 주어진 상대 경로를 vite의 base 옵션에 근거해 절대 경로로 변환합니다.
 *
 * @param path 상대 경로
 * @returns 절대 경로
 */
export function url(path: string): string {
  return new URL(path, import.meta.url).href;
}
