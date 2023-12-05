const ROTATE_HORIZONTAL = 180 * (Math.PI / 180);
const ROTATE_VERTICAL = 90 * (Math.PI / 180);
const ROTATE_NONE = -100;
const VERTEX_GAP = 3;
const HALF_VERTEX_GAP = VERTEX_GAP / 2;
const TOFU = 'tofu';
const FONT_HEIGHT = 824;

const MOVE_COMMAND = 'm';
const LINE_COMMAND = 'l';
const ARC_COMMAND = 'a';
const BEZIER_COMMAND = 'b';

const PATH_COMMANDS = [
  MOVE_COMMAND,
  LINE_COMMAND,
  ARC_COMMAND,
  BEZIER_COMMAND,
] as const;
