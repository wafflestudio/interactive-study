export const DISK_SIZE = 220;
export const DISK_GAP = 100;

export const IDLE_DISK_STYLE = (index: number) =>
  ({
    vertex: { x: 0, y: DISK_GAP * index },
    pivot: "leftTop",
    size: DISK_SIZE,
  }) as const;

export const PICKED_DISK_STYLE = (index: number) =>
  ({
    vertex: { x: DISK_SIZE * 1.2, y: DISK_GAP * index },
    pivot: "leftTop",
    size: DISK_SIZE * 1.2,
  }) as const;

export const PREVIEWED_DISK_STYLE = {
  vertex: { x: 0.5, y: 0.5 },
  pivot: "center",
  heightRatio: 0.8,
} as const;

export const PLAYING_DISK_STYLE = {
  vertex: { x: 1, y: 50 },
  pivot: "rightTop",
  heightRatio: 0.81,
} as const;
