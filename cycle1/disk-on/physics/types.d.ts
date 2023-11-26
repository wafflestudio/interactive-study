export type Coordinates = {
  x: number;
  y: number;
};

export type Area = {
  min: Coordinates; // 인터랙션 구역의 좌상단 좌표
  max: Coordinates; // 인터랙션 구역의 우하단 좌표
};
