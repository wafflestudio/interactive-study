/*!
 * VERSION: 1.6.3
 * DATE: 2019-09-13
 * https://leon-sans.com
 *
 * @license Copyright (c) 2019, Jongmin Kim. All rights reserved.
 **/
import { Graphics } from 'pixi.js';

import { MAX_FONT_WEIGHT, MIN_FONT_WEIGHT } from './core/constants.js';
import { Dispatcher } from './core/dispatcher';
import { Model } from './core/model';
import { shuffle } from './core/util';
import { Color } from './draw/canvas/color.js';
import { Colorful } from './draw/canvas/colorful.js';
import { Grids } from './draw/canvas/grids.js';
import { Lines } from './draw/canvas/lines.js';
import { Pattern } from './draw/canvas/pattern.js';
import { Points } from './draw/canvas/points.js';
import { Wave } from './draw/canvas/wave.js';
import { PixiColor } from './draw/pixi/color.js';
import { PixiLines } from './draw/pixi/lines.js';

type LeonSansProps = {
  text?: string;
  size?: number;
  weight?: number;
  color?: (string | string[])[];
  colorful?: string[];
  tracking?: number;
  leading?: number;
  align?: Align;
  pathGap?: number;
  amplitude?: number;
  width?: number;
  breakWord?: boolean;
  fps?: number;
  isPattern?: boolean;
  isWave?: boolean;
  hasGrid?: boolean;
  hasPoint?: boolean;
  hasBox?: boolean;
};

export default class LeonSans extends Dispatcher {
  private size_: number; // Size of the font
  private weight_: number; // Weight of the font
  private color_: (string | string[])[]; // Color of the font. if some element are array, them will be used as a gradient color.
  private colorful_: string[];
  private tracking_: number; // Tracking of the font
  private leading_: number; // Leading of the font
  private pathGap_: number; // Gap between paths
  private amplitude_: number; // Amplitude of the wave
  private width_: number; // Max width of the text
  private breakWord_: boolean; // Break word
  private fps_: number; // Frames per second
  private frameInterval_: number; // Milliseconds per frame
  private isPattern_: boolean; // If true, it will be rendered using pattern effect
  private isWave_: boolean; // If true, it will be rendered using wave effect
  private hasGrid_: boolean; // If true, it will render grid
  private hasPoint_: boolean; // If true, it will render point
  private hasBox_: boolean; // If true, it will render box
  private model: Model;
  private str_: string; // Text
  private time_: number; // Last time of rendering
  private isOutdated_: boolean; // If it's outdated, it needs to be re-rendered
  private isForceRender_: boolean; // Force re-rendering although it's not outdated
  private updateId_: number;
  private drawingPathsId_: number;
  private patternPathsId_: number;
  private wavePathsId_: number;
  private guideId_: number;

  constructor({
    text = '',
    size = 500,
    weight = MIN_FONT_WEIGHT,
    color = ['#000000'],
    colorful = [
      '#c5d73f',
      '#9d529c',
      '#49a9db',
      '#fec330',
      '#5eb96e',
      '#fc5356',
      '#f38f31',
    ],
    tracking = 0,
    leading = 0,
    align = 'left',
    pathGap = 0.5,
    amplitude = 0.5,
    width = 0,
    breakWord = false,
    fps = 30,
    isPattern = false,
    isWave = false,
    hasGrid = false,
    hasPoint = false,
    hasBox = false,
  }: LeonSansProps) {
    super();

    this.size_ = size;
    this.weight_ = weight;
    this.color_ = color;
    this.colorful_ = shuffle(colorful);
    this.tracking_ = tracking;
    this.leading_ = leading;
    this.pathGap_ = pathGap;
    this.amplitude_ = amplitude;
    this.width_ = width;
    this.breakWord_ = breakWord;
    this.fps_ = fps;
    this.frameInterval_ = 1000 / this.fps_;
    this.isPattern_ = isPattern;
    this.isWave_ = isWave;
    this.hasGrid_ = hasGrid;
    this.hasPoint_ = hasPoint;
    this.hasBox_ = hasBox;

    this.model = new Model();

    this.str_ = '';

    this.time_ = 0;
    this.isOutdated_ = false;
    this.isForceRender_ = false;

    this.updateId_ = 0;
    this.drawingPathsId_ = 0;
    this.patternPathsId_ = 0;
    this.wavePathsId_ = 0;
    this.guideId_ = 0;

    this.text = text;

    this.model.align = align;
  }

  // on(event: string, callback: Function) {
  //   super.on(event, callback);
  //   this.update();
  // }

  // off(event: string, callback: Function) {
  //   return super.off(event, callback);
  // }

  get text() {
    return this.str_;
  }

  set text(str) {
    if (this.str_ == str) return;
    this.str_ = str;
    this.update();
  }

  get size() {
    return this.size_;
  }

  set size(v) {
    if (this.size_ == v) return;
    this.size_ = v;
    this.update();
    this.isForceRender_ = true;
  }

  get weight() {
    return this.weight_;
  }

  set weight(v) {
    if (v < MIN_FONT_WEIGHT) {
      v = MIN_FONT_WEIGHT;
    } else if (v > MAX_FONT_WEIGHT) {
      v = MAX_FONT_WEIGHT;
    }
    if (this.weight_ == v) return;
    this.weight_ = v;
    this.update();
    this.isForceRender_ = true;
  }

  get color() {
    return this.color_;
  }

  set color(v) {
    if (this.color_ == v) return;
    this.color_ = v;
  }

  get tracking() {
    return this.tracking_;
  }

  set tracking(v) {
    if (this.tracking_ == v) return;
    this.tracking_ = v;
    this.update();
    this.isForceRender_ = true;
  }

  get leading() {
    return this.leading_;
  }

  set leading(v) {
    if (this.leading_ == v) return;
    this.leading_ = v;
    this.update();
    this.isForceRender_ = true;
  }

  get align() {
    return this.model.align;
  }

  set align(v) {
    if (this.model.align != v) {
      this.model.align = v;
      this.updateId_++;
      this.updateSignal();
    }
  }

  get pathGap() {
    return this.pathGap_;
  }

  set pathGap(v) {
    if (this.pathGap_ != v) {
      this.pathGap_ = v;
      this.updatePatternPaths(true);
      this.updateWavePaths(true);
      this.isForceRender_ = true;
    }
  }

  get amplitude() {
    return this.amplitude_;
  }

  set amplitude(v) {
    this.amplitude_ = v;
  }

  get rect() {
    return this.model.rect;
  }

  set maxWidth(v) {
    if (this.width_ == v) return;
    this.width_ = v;
    this.update();
  }

  get maxWidth() {
    return this.width_;
  }

  set breakWord(v) {
    if (this.breakWord_ == v) return;
    this.breakWord_ = v;
    this.update();
  }

  get breakWord() {
    return this.breakWord_;
  }

  get isPattern() {
    return this.isPattern_;
  }

  set isPattern(v) {
    this.isPattern_ = v;
    this.updatePatternPaths(true);
  }

  get isWave() {
    return this.isWave_;
  }

  set isWave(v) {
    this.isWave_ = v;
    this.updateWavePaths(true);
  }

  get hasGrid() {
    return this.hasGrid_;
  }

  set hasGrid(v) {
    this.hasGrid_ = v;
  }

  get hasPoint() {
    return this.hasPoint_;
  }

  set hasPoint(v) {
    this.hasPoint_ = v;
  }

  get hasBox() {
    return this.hasBox_;
  }

  set hasBox(v) {
    this.hasBox_ = v;
  }

  get fps() {
    return this.fps_;
  }

  set fps(v) {
    this.fps_ = v;
    this.frameInterval_ = 1000 / this.fps_;
  }

  get lineWidth() {
    return this.model.lineWidth;
  }

  get scale() {
    return this.model.scale;
  }

  get drawing() {
    return this.model.drawing;
  }

  get data() {
    return this.model.data;
  }

  /**
   * 리온 산스의 위치를 설정합니다.
   * @param x x 좌표
   * @param y y 좌표
   */
  position(x = 0, y = 0) {
    if (this.model.position(x, y)) {
      this.updateId_++;
      this.updateSignal();
    }
  }

  update() {
    this.updateId_++;

    this.model.update(
      this.str_,
      this.width_,
      this.breakWord_,
      this.weight_,
      this.size_,
      this.tracking_,
      this.leading_,
    );

    if (this.isPattern_ || this.isWave_) {
      this.updatePatternPaths();
      this.updateWavePaths();
    } else {
      this.updateSignal();
    }
  }

  updateGuide() {
    if (this.guideId_ != this.updateId_) {
      this.guideId_ = this.updateId_;
      this.model.updateGuide();
    }
  }

  /**
   * Update paths for drawing in WebGL (PIXI.js). It's very expensive, only call when it needs.
   */
  updateDrawingPaths() {
    if (this.drawingPathsId_ != this.updateId_) {
      this.drawingPathsId_ = this.updateId_;
      this.model.updateDrawingPaths();
    }
  }

  /**
   * Update paths for pattern
   * @param {boolean} force - Force execution
   */
  updatePatternPaths(force?: boolean) {
    if (this.isPattern_ && (force || this.patternPathsId_ != this.updateId_)) {
      this.patternPathsId_ = this.updateId_;
      this.model.updatePatternPaths(this.pathGap_);
      this.isForceRender_ = true;
      this.updateSignal();
    }
  }

  /**
   * Update paths for wave effect
   * @param {boolean} force - Force execution
   */
  updateWavePaths(force?: boolean) {
    if (this.isWave_ && (force || this.wavePathsId_ != this.updateId_)) {
      this.wavePathsId_ = this.updateId_;
      this.model.updateWavePaths(this.pathGap_);
      this.isForceRender_ = true;
      this.updateSignal();
    }
  }

  updateSignal() {
    this.model.updateLinesForRect();
    this.model.updatePathsForRect();
    this.dispatch('update', this.model);
  }

  reset() {
    this.size_ = 500;
    this.weight_ = MIN_FONT_WEIGHT;
    this.color_ = ['#000000'];
    this.tracking_ = 0;
    this.leading_ = 0;
    this.pathGap_ = 0.5;
    this.amplitude_ = 0.5;
    this.width_ = 0;
    this.breakWord_ = false;
    this.fps_ = 30;
    this.frameInterval_ = 1000 / this.fps_;
    this.isPattern_ = false;
    this.isWave_ = false;
    this.hasGrid_ = false;

    this.str_ = '';

    this.time_ = 0;
    this.isOutdated_ = false;
    this.isForceRender_ = false;

    this.updateId_ = 0;
    this.drawingPathsId_ = 0;
    this.patternPathsId_ = 0;
    this.wavePathsId_ = 0;
    this.guideId_ = 0;

    this.model.reset();
  }

  dispose() {
    this.reset();
    this.model = new Model();
  }

  /**
   * Draw text in WebGL with PIXI.js
   * @param {PIXI.Graphics} graphics
   */
  drawPixi(graphics: Graphics) {
    const total = this.model.data.length;
    let i, d, color;
    for (i = 0; i < total; i++) {
      d = this.model.data[i];
      color = PixiColor(i, d, this.color_);
      PixiLines(graphics, d, this.lineWidth, color);
    }
  }

  /**
   * Draw text in the Canvas element.
   * @param ctx
   * @param t time stemp from requestAnimationFrame(). [Default: Date.now()]
   * @param w width of the pattern. [Default: 40]
   * @param h height of the pattern. [Default: 10]
   */
  draw(
    ctx: CanvasRenderingContext2D,
    { t, w, h }: { t?: DOMHighResTimeStamp; w?: number; h?: number } = {},
  ) {
    if (this.hasGrid_) this.grid(ctx);
    if (this.hasPoint_) this.point(ctx);
    if (this.hasBox_) this.box(ctx);
    if (this.isWave_) {
      this.wave(ctx, t);
    } else if (this.isPattern_ && w && h) {
      this.pattern(ctx, w, h);
    } else {
      ctx.lineWidth = this.lineWidth;
      this.model.data.forEach((data, index) => {
        Color(ctx, index, data, this.color_);
        Lines(ctx, data);
      });
    }
  }

  /**
   * Draw the colorful effect.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawColorful(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = this.lineWidth;
    Colorful(ctx, this.model, this.colorful_);
  }

  /**
   * Draw the wave effect.
   * @param {CanvasRenderingContext2D} ctx
   * @param {DOMHighResTimeStamp} t time stemp from requestAnimationFrame()
   */
  wave(ctx: CanvasRenderingContext2D, t: DOMHighResTimeStamp = Date.now()) {
    ctx.lineWidth = this.lineWidth;

    if (!this.time_) this.time_ = t;
    const elapsedTime = t - this.time_;
    // 아래 조건 충족 시 Wave를 새로 그린다.
    if (elapsedTime > this.frameInterval_ || this.isForceRender_) {
      this.time_ = t;
      this.isOutdated_ = true;
    } else {
      this.isOutdated_ = false;
    }
    this.isForceRender_ = false;

    const total = this.model.data.length;
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.model.data[i];
      Color(ctx, i, d, this.color_);
      Wave(
        ctx,
        d,
        this.model.scale,
        this.amplitude_,
        this.weight_,
        this.isOutdated_,
      );
    }
  }

  /**
   * Draw rectangle shapes at each path point.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} w pattern width
   * @param {number} h pattern height
   */
  pattern(ctx: CanvasRenderingContext2D, w: number = 40, h: number = 10) {
    const tw = w * this.model.scale;
    const th = h * this.model.scale;

    const total = this.model.data.length;
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.model.data[i];
      Pattern(ctx, d, tw, th);
    }
  }

  /**
   * Draw grid for each type.
   * @param {CanvasRenderingContext2D} ctx
   */
  grid(ctx: CanvasRenderingContext2D) {
    this.updateGuide();

    const total = this.model.data.length;
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.model.data[i];
      Grids(ctx, d);
    }
  }

  /**
   * Draw circles at each drawing point and lines for each type.
   * @param {CanvasRenderingContext2D} ctx
   */
  point(ctx: CanvasRenderingContext2D) {
    const total = this.model.data.length;
    let i, d;
    for (i = 0; i < total; i++) {
      d = this.model.data[i];
      Points(ctx, d);
    }
  }

  /**
   * Draw outline box for the text.
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  box(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.strokeStyle = '#0b90dc';
    ctx.rect(
      this.model.rect.x,
      this.model.rect.y,
      this.model.rect.w,
      this.model.rect.h,
    );
    ctx.stroke();
  }
}
