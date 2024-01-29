export function randomIdx(arr: unknown[]) {
  return Math.floor(Math.random() * arr.length);
}

export function degToRad(deg: number) {
  return deg * (Math.PI / 180);
}

export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}