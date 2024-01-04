import gsap, { Power0, Power3 } from 'gsap';
import { CHARSET, ModelData } from 'leonsans';
import LeonSans from 'leonsans/src/leonsans';
import * as PIXI from 'pixi.js';

import { randomIdx } from '../utils';

const TYPO_EASING = Power0.easeNone;
const TYPO_DRAWING_DURATION = 1;

const LEAVES_EASING = Power3.easeOut;
const LEAVES_DRAWING_SPEED = 1;
const LEAVES_DRAWING_DELAY = TYPO_DRAWING_DURATION - 0.05;

const ORNAMENT_SOURCE_NAMES = [
  'ball_1.svg',
  'ball_2.svg',
  'candy.svg',
  'fruit_1.svg',
  'fruit_2.svg',
  'pinecone_1.svg',
  'pinecone_2.svg',
  'poinsettia_1.svg',
  'poinsettia_2.svg',
  'ribbon.svg',
  'star.svg',
];
const ORNAMENT_ORDER = [
  'pinecone_2',
  'ball_2',
  'ribbon',
  'candy',
  'fruit_1',
  'pinecone_1',
  'poinsettia_1',
  'ball_1',
  'pinecone_2',
  'fruit_2',
  'ball_2',
  'ribbon',
  'candy',
  'poinsettia_2',
  'fruit_1',
  'ball_1',
  'pinecone_1',
  'poinsettia_1',
  'fruit_2',
];
const ORNAMENT_PROBABILITY = 0.15;
const ORNAMENT_PROBABILITY_INCREASE = 0.24;
const ORNAMENT_SCALE = 0.28;
const ORNAMENT_STAR_SCALE = 0.5;
const ORNAMENT_RADIUS = 50;

type WreathSansProps = {
  canvas: HTMLCanvasElement;
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  graphics: PIXI.Graphics;
  leon: LeonSans;
  pixelRatio: number;
};

export default class WreathSans {
  canvas: HTMLCanvasElement;
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  graphics: PIXI.Graphics;
  leon: LeonSans;
  pixelRatio: number;
  leafSources: PIXI.SpriteSource[];
  ornamentSourceMap: Record<string, PIXI.SpriteSource>;
  ornamentOrder: string[];
  containers: PIXI.Container[];

  constructor(props: WreathSansProps) {
    this.canvas = props.canvas;
    this.renderer = props.renderer;
    this.stage = props.stage;
    this.graphics = props.graphics;
    this.leon = props.leon;
    this.pixelRatio = props.pixelRatio;
    this.containers = [];
    this.leafSources = [];
    this.ornamentSourceMap = {};
    this.ornamentOrder = ORNAMENT_ORDER;

    this.loadAssets().then(() => {
      this.redraw();
    });
  }
  insertText(text: string, idx: number) {
    // check text
    if (text.length !== 1 || !(CHARSET.includes(text) || ' \n'.includes(text)))
      return;

    // add text
    this.leon.text =
      this.leon.text.slice(0, idx) + text + this.leon.text.slice(idx);

    // recalculate position of new text
    const x = (this.canvas.clientWidth - this.leon.rect.w) / 2;
    const y = (this.canvas.clientHeight - this.leon.rect.h) / 2;
    this.leon.position(x, y);

    // update paths
    this.leon.updateDrawingPaths();

    // draw
    // FIXME : \n 처리
    if (text === '\n') {
      this.updatePositions();
      return;
    }
    const lineBreak = this.leon.text.slice(0, idx).split('\n').length - 1;
    this.drawTypo(this.leon.data[idx - lineBreak]);
    this.drawLeaves(
      this.leon.data[idx - lineBreak],
      this.makeContainer(idx - lineBreak),
    );
    this.updatePositions();
  }

  /**
   * n번째 위치의 글자 삭제하기
   *
   * @param idx 삭제할 위치
   * @param text 삭제 후 남은 텍스트
   */
  deleteText(idx: number, deleted: number) {
    // delete text
    const preLineBreak = this.leon.text.slice(0, idx).split('\n').length - 1;
    const midLineBreak =
      this.leon.text.slice(idx, idx + deleted).split('\n').length - 1;
    this.leon.text =
      this.leon.text.slice(0, idx) + this.leon.text.slice(idx + deleted);
    this.removeContainers(
      idx - preLineBreak,
      idx - preLineBreak + deleted - midLineBreak,
    );

    // recalculate position of new text
    const x = (this.canvas.clientWidth - this.leon.rect.w) / 2;
    const y = (this.canvas.clientHeight - this.leon.rect.h) / 2;
    this.leon.position(x, y);

    // update paths
    this.leon.updateDrawingPaths();

    // draw
    this.updatePositions();
  }

  /**
   * 글자를 교체하고 다시 그리기
   *
   * @param text 교체할 텍스트
   */
  replaceText(text: string) {
    // check text
    if (!text.split('').every((c) => CHARSET.includes(c) || ' \n'.includes(c)))
      return;

    // set text
    this.leon.text = text;

    // recalculate position of new text
    const x = (this.canvas.clientWidth - this.leon.rect.w) / 2;
    const y = (this.canvas.clientHeight - this.leon.rect.h) / 2;
    this.leon.position(x, y);

    // redraw
    this.redraw();
  }

  redraw() {
    this.leon.updateDrawingPaths();

    for (let i = 0; i < this.leon.drawing.length; i++) {
      gsap.killTweensOf(this.leon.drawing[i]);
      this.drawTypo(this.leon.data[i]);
    }

    this.removeContainers();
    this.leon.data.forEach((d) => this.drawLeaves(d, this.makeContainer()));
  }

  /**
   * 글자들의 위치를 업데이트한다.
   */
  updatePositions() {
    let leonIdx = 0;
    this.containers.forEach((container, idx) => {
      // FIXME : \n 처리
      while (this.leon.data[leonIdx] === undefined) leonIdx++;
      container.position.set(
        this.leon.data[idx].rect.x,
        this.leon.data[idx].rect.y,
      );
    });
  }

  private async loadAssets() {
    for (let i = 1; i <= 20; i++) {
      const leaf = await PIXI.Assets.load<PIXI.SpriteSource>(
        `leaves/leaf_${i}.svg`,
      );
      this.leafSources.push(leaf);
    }

    // save ornament
    for (const name of ORNAMENT_SOURCE_NAMES) {
      const ornament = await PIXI.Assets.load<PIXI.SpriteSource>(
        `ornaments/${name}`,
      );
      this.ornamentSourceMap[name.split('.')[0]] = ornament;
    }
  }

  private makeContainer(idx: number = this.containers.length) {
    const container = new PIXI.Container();
    this.containers = [
      ...this.containers.slice(0, idx),
      container,
      ...this.containers.slice(idx),
    ];
    // FIXME : \n 처리
    if (this.leon.data[idx] !== undefined) {
      container.position.set(
        this.leon.data[idx].rect.x,
        this.leon.data[idx].rect.y,
      );
    }

    this.stage.addChild(container);
    return container;
  }

  /**
   * [start, end) 범위의 컨테이너들을 삭제한다.
   * 범위가 지정되지 않으면 모든 컨테이너를 삭제한다.
   * @param start 시작 인덱스 (포함)
   * @param end 끝 인덱스 (미포함)
   */
  private removeContainers(
    start: number = 0,
    end: number = this.containers.length,
  ) {
    this.containers.slice(start, end).forEach((c) => c.destroy());
    this.containers = [
      ...this.containers.slice(0, start),
      ...this.containers.slice(end),
    ];
  }

  private drawLeaves(typo: ModelData, container: PIXI.Container) {
    typo.drawingPaths
      .filter((pos, i) => pos.type == 'a' || i % 11 > 6)
      .forEach((pos, i, every) => {
        const source = this.leafSources[randomIdx(this.leafSources)];
        const leafSprite = PIXI.Sprite.from(source);
        leafSprite.anchor.set(0.5);
        leafSprite.x = pos.x - typo.rect.x;
        leafSprite.y = pos.y - typo.rect.y;
        const scale = this.leon.scale * 0.3;
        container.addChild(leafSprite);
        gsap.fromTo(
          leafSprite.scale,
          {
            x: 0,
            y: 0,
          },
          {
            x: scale,
            y: scale,
            ease: LEAVES_EASING,
            duration: 0.5,
            delay: (i / every.length) * LEAVES_DRAWING_SPEED + LEAVES_DRAWING_DELAY,
          },
        );
      });

    // draw ornament
    let probability = ORNAMENT_PROBABILITY;
    let ornamentIdx = 0;
    typo.drawingPaths
      .filter((pos, i) => pos.type == 'a' || i % 11 > 6)
      .forEach((pos, i, every) => {
        if (Math.random() > probability && pos.type !== 'a') {
          probability += ORNAMENT_PROBABILITY_INCREASE;
          return;
        }
        ornamentIdx = (ornamentIdx + 1) % this.ornamentOrder.length;
        probability = ORNAMENT_PROBABILITY;
        const name =
          this.ornamentOrder.length > 0
            ? this.ornamentOrder[ornamentIdx]
            : Object.keys(this.ornamentSourceMap)[
                randomIdx(ORNAMENT_SOURCE_NAMES)
              ];
        const source =
          pos.type === 'a'
            ? this.ornamentSourceMap['star']
            : this.ornamentSourceMap[name];
        const scale =
          pos.type === 'a'
            ? this.leon.scale * ORNAMENT_STAR_SCALE
            : this.leon.scale * ORNAMENT_SCALE;
        const radius = pos.type === 'a' ? 0 : this.leon.scale * ORNAMENT_RADIUS;
        const ornamentSprite = PIXI.Sprite.from(source);
        ornamentSprite.anchor.set(0.5);
        ornamentSprite.x = pos.x - typo.rect.x + radius * (Math.random() - 0.5);
        ornamentSprite.y = pos.y - typo.rect.y + radius * (Math.random() - 0.5);
        ornamentSprite.scale.set(0);
        ornamentSprite.rotation = Math.random() * Math.PI * 2;
        container.addChild(ornamentSprite);

        gsap.fromTo(
          ornamentSprite.scale,
          {
            x: 0,
            y: 0,
          },
          {
            x: scale,
            y: scale,
            ease: Power3.easeOut,
            duration: 0.5,
            delay: (i / every.length) * 1 + 0.95,
          },
        );
      });
  }

  private drawTypo(typo: ModelData) {
    if (!typo) return;
    gsap.fromTo(
      typo.drawing,
      {
        value: 0,
      },
      {
        value: 1,
        ease: TYPO_EASING,
        duration: TYPO_DRAWING_DURATION,
      },
    );
  }
}
