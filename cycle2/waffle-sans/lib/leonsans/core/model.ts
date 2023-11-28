import { typo } from '../font/index';
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
  getRect,
  getScale,
  getTracking,
  getWeightRatio,
} from './util';

export class Model {
  lineWidth_: number;
  drawing_: any[];
  data_: ModelData[];
  paths_: any;
  lines_: any;
  rect_: Rect;
  align_: Align;
  scale_: number;
  fontRatio_: number;
  drawingPaths?: any;
  wavePaths?: any;

  constructor() {
    this.lineWidth_ = 1;
    this.drawing_ = [];
    this.data_ = [];
    this.paths_ = null;
    this.lines_ = null;
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

  get paths() {
    return this.paths_;
  }

  get lines() {
    return this.lines_;
  }

  set lines(v) {
    this.lines_ = v;
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

  setPosition() {
    const total = this.data_.length;
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.data_[i];
      d.rect.x =
        d.originPos.x + this.rect_.x + getAlignGapX(this.align_, d.alignGapX);
      d.rect.y = d.originPos.y + this.rect_.y;
    }
  }

  updateDrawingPaths() {
    const total = this.data_.length;
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.data_[i];
      d.drawingPaths = addRectToPaths(getPaths(this, d, -1, false), d);
    }
  }

  updatePatternPaths(pathGap: number) {
    const total = this.data_.length;
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.data_[i];
      d.rawPaths = getPaths(this, d, pathGap, true);
    }
  }

  updateWavePaths(pathGap: number) {
    const total = this.data_.length;
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.data_[i];
      d.rawWavePaths = getPaths(this, d, pathGap, false);
    }
  }

  updateGuide() {
    const total = this.data_.length;
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.data_[i];
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

    const total = textGroup.length;
    const total2 = total - 1;
    let maxW = 0,
      maxH = 0,
      tmp: { tw: number; arr: ModelData[] }[] = [];

    for (let i = 0; i < total; i++) {
      const gt = textGroup[i];
      const j_total = gt.length;
      const j_total2 = j_total - 1;
      let tw = 0;
      let th = 0;
      let tx = 0;
      let ty = 0;
      tmp[i] = {
        tw: 0,
        arr: [],
      };
      for (let j = 0; j < j_total; j++) {
        const str = gt[j];
        const fontData = typo(str);
        const m_rect = getRect(fontData, scale);
        tw += m_rect.w;
        th = m_rect.h;
        if (j < j_total2) {
          tw += m_tracking;
        }
        if (i < total2) {
          th += m_leading;
        }
        m_rect.x = tx;
        m_rect.y = ty;
        let s_pos = {
          x: tx,
          y: ty,
        };

        tmp[i].arr[j] = {
          str: str,
          typo: fontData,
          rect: m_rect,
          originPos: s_pos,
          center: getCenter(m_rect.w, m_rect.h, scale),
          range: getRange(fontData, weightRatio, circleRound),
        };

        tx = tw;
      }
      ty += th;
      tmp[i].tw = tw;
      maxW = Math.max(maxW, tw);
      maxH += th;
    }

    this.rect_.w = maxW;
    this.rect_.h = maxH;

    this.drawing_ = [];
    const arr: ModelData[] = [];
    let aGapX, drawing;
    for (const a of tmp) {
      aGapX = setAlignGapX(maxW, a.tw);
      for (const b of a.arr) {
        b.alignGapX = aGapX;
        b.pointsLength = getLengths(b, this);
        arr.push(b);
        drawing = {
          value: 1,
        };
        this.drawing_.push(drawing);
        b.drawing = drawing;

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
    const total = this.data_.length;
    const paths = [];
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.data_[i];
      if (d.rawWavePaths) {
        d.wavePaths = addRectToPaths(d.rawWavePaths, d);
      }
      if (d.rawPaths) {
        d.paths = addRectToPaths(d.rawPaths, d);
        Array.prototype.push.apply(paths, d.paths);
      }
    }

    this.paths_ = paths;
  }

  updateLinesForRect() {
    const total = this.data_.length;
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.data_[i];
      d.lines = getLines(d);
    }
  }

  reset() {
    this.lineWidth_ = 1;
    this.drawing_ = [];
    this.data_ = [];
    this.paths_ = null;
    this.lines_ = null;
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
