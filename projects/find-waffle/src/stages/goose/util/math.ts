export const angleDiff = (a: number, b: number) => {
  let diff = Math.abs(a - b);
  return Math.PI < diff ? 2 * Math.PI - diff : diff;
};

export const normalizeAngle = (radian: number) => {
  return (radian + 2 * Math.PI) % (2 * Math.PI);
};
