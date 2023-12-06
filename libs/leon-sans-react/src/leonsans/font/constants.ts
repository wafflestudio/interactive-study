export const ROTATE_HORIZONTAL = 180 * (Math.PI / 180);
export const ROTATE_VERTICAL = 90 * (Math.PI / 180);
export const ROTATE_NONE = -100;
export const VERTEX_GAP = 3;
export const HALF_VERTEX_GAP = VERTEX_GAP / 2;
export const TOFU = 'tofu';
export const FONT_HEIGHT = 824;

export const MOVE_COMMAND = 'm';
export const LINE_COMMAND = 'l';
export const ARC_COMMAND = 'a';
export const BEZIER_COMMAND = 'b';

export const PATH_COMMANDS = [
  MOVE_COMMAND,
  LINE_COMMAND,
  ARC_COMMAND,
  BEZIER_COMMAND,
] as const;
