/**
 * 주어진 상대 경로를 vite의 base 옵션에 근거해 절대 경로로 변환합니다.
 *
 * @param path 상대 경로
 * @returns 절대 경로
 */
export function url(path: string): string {
  const BASE_URL = `${window.location.origin}${import.meta.env.BASE_URL}`;
  if (path.startsWith('/')) path = path = path.slice(1);
  return new URL(path, BASE_URL).href;
}
