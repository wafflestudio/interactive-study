import { ColorSource, Graphics } from 'pixi.js';

import { Point } from '../../core/point';

export function PixiLines(
  graphics: Graphics,
  data: ModelData,
  lineW: number,
  color: ColorSource,
) {
  if (data.drawing.value == 1) {
    data.lines?.forEach((line) => {
      eachLine_(graphics, line, lineW, color);
    });
  } else {
    data.drawingPaths
      ?.slice(0, data.drawingPaths.length * data.drawing.value)
      .forEach((path) => {
        eachPath_(graphics, path, lineW, color, data.drawing.value);
      });
  }
}

function eachLine_(
  graphics: Graphics,
  data: ModelDataLine,
  lineW: number,
  color: ColorSource,
) {
  const pos = data.pos;
  if (pos.type == 'a') {
    graphics.lineStyle(0, color, 0);
    graphics.beginFill(color);
    graphics.drawCircle(pos.x, pos.y, pos.radius!);
    graphics.endFill();
  } else if (pos.type == 'm') {
    graphics.lineStyle(lineW, color, 1);
    graphics.moveTo(pos.x, pos.y);
  } else if (pos.type == 'l') {
    graphics.lineTo(pos.x, pos.y);
  } else if (pos.type == 'b') {
    graphics.bezierCurveTo(pos.x, pos.y, pos.x2!, pos.y2!, pos.x3!, pos.y3!);
  }
  if (data.closePath) {
    graphics.closePath();
  }
}

function eachPath_(
  graphics: Graphics,
  pos: Point,
  lineW: number,
  color: ColorSource,
  dValue: number,
) {
  if (pos.type == 'a') {
    graphics.lineStyle(0, color, 0);
    graphics.beginFill(color);
    graphics.drawCircle(pos.x, pos.y, pos.radius! * dValue);
    graphics.endFill();
  } else {
    if (pos.start == 1) {
      graphics.lineStyle(lineW, color, 1);
      graphics.moveTo(pos.x, pos.y);
    } else {
      graphics.lineTo(pos.x, pos.y);
    }
  }
}
