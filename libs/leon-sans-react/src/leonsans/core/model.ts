import { getTypo } from '../font/index';
import { getAlignGapX, setAlignGapX } from './align';
import { getTextGroup } from './group';
import { getGrid, getGuide } from './guide';
import { getLengths } from './length';
import { getPaths } from './paths';
import {
  addRectToPaths,
  getCenter,
  getCircleRound,
  getFontRatio,
  getFontW,
  getLeading,
  getLineW,
  getLines,
  getRange,
  getScale,
  getScaledRect,
  getTracking,
  getWeightRatio,
} from './util';

export class Model {
  lineWidth_: number;
  drawing_: Drawing[];
  data_: ModelData[];
  rect_: Rect;
  align_: Align;
  scale_: number;
  fontRatio_: number;

  constructor() {
    this.lineWidth_ = 1;
    this.drawing_ = [];
    this.data_ = [];
    this.rect_ = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };
    this.align_ = 'left';
    this.scale_ = 1;
    this.fontRatio_ = 1;
  }

  get data() {
    return this.data_;
  }

  get lineWidth() {
    return this.lineWidth_;
  }

  get fontRatio() {
    return this.fontRatio_;
  }

  get scale() {
    return this.scale_;
  }

  get rect() {
    return this.rect_;
  }

  get drawing() {
    return this.drawing_;
  }

  set align(v) {
    if (this.align_ != v) {
      this.align_ = v;
      this.setPosition();
    }
  }

  get align() {
    return this.align_;
  }

  /**
   * 리온 산스의 위치를 설정합니다.
   * @param x x 좌표
   * @param y y 좌표
   */
  position(x: number, y: number) {
    if (this.rect_.x != x || this.rect_.y != y) {
      this.rect_.x = x;
      this.rect_.y = y;
      this.setPosition();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Set position of each typo
   */
  setPosition() {
    for (const d of this.data_) {
      d.rect.x =
        d.originPos.x + this.rect_.x + getAlignGapX(this.align_, d.alignGapX);
      d.rect.y = d.originPos.y + this.rect_.y;
    }
  }

  updateDrawingPaths() {
    for (const d of this.data_) {
      d.drawingPaths = addRectToPaths(getPaths(this, d, -1, false), d);
    }
  }

  updatePatternPaths(pathGap: number) {
    const total = this.data_.length;
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.data_[i];
      d.relativePaths = getPaths(this, d, pathGap, true);
    }
  }

  updateWavePaths(pathGap: number) {
    const total = this.data_.length;
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.data_[i];
      d.relativeWavePaths = getPaths(this, d, pathGap, false);
    }
  }

  updateGuide() {
    for (const d of this.data_) {
      d.guide = getGuide(d.typo, this.scale);
      d.grid = getGrid(d.typo, this.scale);
    }
  }

  update(
    text: string,
    width: number,
    breakWord: boolean,
    weight: number,
    size: number,
    tracking: number,
    leading: number,
  ) {
    const fontW = getFontW(weight);
    const weightRatio = getWeightRatio(fontW);
    const circleRound = getCircleRound(fontW);
    const scale = getScale(size);
    const m_tracking = getTracking(tracking, scale);
    const m_leading = getLeading(leading, scale);
    const fontRatio = getFontRatio(weightRatio);

    this.fontRatio_ = fontRatio;
    this.scale_ = scale;
    this.lineWidth_ = getLineW(fontW, scale);

    const textGroup = getTextGroup(text, scale, width, breakWord);

    let maxW = 0; // max width
    let maxH = 0; // max height

    let tx = 0; // total x
    let ty = 0; // total y

    const tmp = textGroup.map((word, i) => {
      let tw = 0; // total width
      let th = 0; // total height

      const arr: (Omit<ModelData, 'alignGapX' | 'pointsLength' | 'drawing'> & {
        alignGapX?: AlignGapX;
        pointsLength?: LinesLengths;
        drawing?: Drawing;
      })[] = word.map((str, j) => {
        const typo = getTypo(str);
        const scaledRect = getScaledRect(typo, scale);
        tw += scaledRect.w;
        th = scaledRect.h;
        if (j < word.length - 1) {
          tw += m_tracking;
        }
        if (i < textGroup.length - 1) {
          th += m_leading;
        }
        scaledRect.x = tx;
        scaledRect.y = ty;
        const startPosition = {
          x: tx,
          y: ty,
        };

        const res = {
          str: str,
          typo: typo,
          rect: scaledRect,
          originPos: startPosition,
          center: getCenter(scaledRect.w, scaledRect.h, scale),
          range: getRange(typo, weightRatio, circleRound),
          lines: [],
          paths: [],
          wavePaths: [],
          guide: [],
          grid: [],
          relativePaths: [],
          relativeWavePaths: [],
          drawingPaths: [],
        };
        tx = tw;
        return res;
      });

      ty += th;
      maxW = Math.max(maxW, tw);
      maxH += th;

      return {
        tw,
        arr,
      };
    });

    this.rect_.w = maxW;
    this.rect_.h = maxH;

    this.drawing_ = [];
    const arr: ModelData[] = [];
    for (const a of tmp) {
      for (const b of a.arr) {
        b.alignGapX = setAlignGapX(maxW, a.tw);
        b.pointsLength = getLengths(b, this);
        const drawing: Drawing = {
          value: 1,
        };
        this.drawing_.push(drawing);
        b.drawing = drawing;
        arr.push(b as ModelData);

        // add converted Vector
        for (const c of b.typo.p) {
          c.cv = [];
          for (const d of c.v) {
            c.cv.push(d.convert(b, this));
          }
        }
      }
    }

    this.data_ = arr;
    this.setPosition();
  }

  updatePathsForRect() {
    this.data_.forEach((d) => {
      d.wavePaths = addRectToPaths(d.relativeWavePaths, d);
      d.paths = addRectToPaths(d.relativePaths, d);
    });
  }

  updateLinesForRect() {
    this.data_.forEach((d) => {
      d.lines = getLines(d);
    });
  }

  reset() {
    this.lineWidth_ = 1;
    this.drawing_ = [];
    this.data_ = [];
    this.rect_ = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };
    this.align_ = 'left';
    this.scale_ = 1;
    this.fontRatio_ = 1;
  }
}
