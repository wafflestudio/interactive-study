import gsap, { Power0, Power3 } from 'gsap';
import { CHARSET, ModelData } from 'leonsans';
import LeonSans from 'leonsans/src/leonsans';
import * as PIXI from 'pixi.js';

import { degToRad, randomIdx } from '../utils';
import Ornament, { OrnamentLoadProps } from './Ornament';
import _ornament_data from './ornament_data.json';

const ornament_data = _ornament_data as OrnamentLoadProps[];

const TYPO_EASING = Power0.easeNone;
const TYPO_DRAWING_DURATION = 1;

const LEAVES_EASING = Power3.easeOut;
const LEAVES_DRAWING_SPEED = 1;
const LEAVES_DRAWING_DELAY = TYPO_DRAWING_DURATION - 0.05;

const ORNAMENT_PROBABILITY = 0.15;
const ORNAMENT_PROBABILITY_INCREASE = 0.24;

type WreathSansProps = {
  canvas: HTMLCanvasElement;
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  graphics: PIXI.Graphics;
  leon: LeonSans;
  pixelRatio: number;
  ornamentOrder?: string[];
};

export default class WreathSans {
  canvas: HTMLCanvasElement;
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  graphics: PIXI.Graphics;
  leon: LeonSans;
  pixelRatio: number;
  leafSources: PIXI.SpriteSource[];
  ornamentMap: Record<string, Ornament>;
  ornamentOrder: string[];
  containers: PIXI.Container[];
  loaded: boolean = false;
  loadingPromise: Promise<void>;

  constructor(props: WreathSansProps) {
    this.canvas = props.canvas;
    this.renderer = props.renderer;
    this.stage = props.stage;
    this.graphics = props.graphics;
    this.leon = props.leon;
    this.pixelRatio = props.pixelRatio;
    this.containers = [];
    this.leafSources = [];
    this.ornamentMap = {};
    this.ornamentOrder = props.ornamentOrder ?? [];

    this.loadingPromise = this.loadAssets().then(() => {
      this.loaded = true;
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

    // FIXME : \n 처리
    if (text === '\n') {
      this.updatePositions();
      return;
    }
    /**
     * idx 전까지 줄바꿈 개수 세기
     * 왜냐하면 줄바꿈은 leon.text에는 포함되어 있지만 leon.data에는 포함되어 있지 않기 때문
     */
    const lineBreak = this.leon.text.slice(0, idx).split('\n').length - 1;

    // 새로 써진 글자만 다시 애니메이팅하기
    this.drawTypo(this.leon.data[idx - lineBreak]);
    this.drawLeaves(idx - lineBreak);
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
    this.leon.data.forEach(() => this.drawLeaves());
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
    for (const ornamentProp of ornament_data) {
      const ornament = await Ornament.load(ornamentProp);
      this.ornamentMap[ornament.name] = ornament;
    }
  }

  private makeContainer(idx: number) {
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

  private drawLeaves(idx: number = this.containers.length) {
    const typo = this.leon.data[idx];
    const container = this.makeContainer(idx);
    typo.drawingPaths
      .filter((_, i) => i % 11 > 6)
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
            delay:
              (i / every.length) * LEAVES_DRAWING_SPEED + LEAVES_DRAWING_DELAY,
          },
        );
      });

    // draw ornament
    let probability = ORNAMENT_PROBABILITY;
    let ornamentIdx = -1;
    typo.drawingPaths
      .filter((pos, i) => pos.type == 'a' || i % 11 > 6)
      .forEach((pos, i, every) => {
        const isStar = pos.type === 'a';
        if (Math.random() > probability && pos.type !== 'a') {
          probability += ORNAMENT_PROBABILITY_INCREASE;
          return;
        }
        ornamentIdx = (ornamentIdx + 1) % this.ornamentOrder.length;
        probability = ORNAMENT_PROBABILITY;
        const name =
          this.ornamentOrder.length > 0
            ? this.ornamentOrder[ornamentIdx]
            : Object.keys(this.ornamentMap)[
                randomIdx(Object.keys(this.ornamentMap))
              ];
        const ornament = isStar
          ? this.ornamentMap['star']
          : this.ornamentMap[name];
        const scale = ornament.scale * this.leon.scale;
        const ornamentSprite = PIXI.Sprite.from(ornament.source);
        ornamentSprite.anchor.set(0.5);
        ornamentSprite.x = pos.x - typo.rect.x;
        ornamentSprite.y = pos.y - typo.rect.y;
        /**
         * 별일 경우는 위 방향으로 살짝 올려야 균형이 맞음
         * 그 외에는 랜덤하게 x, y 오프셋을 줘서 자연스럽게
         */
        if (isStar) {
          ornamentSprite.y -= 7 * this.leon.scale;
        } else {
          const radius = this.leon.scale * 50;
          ornamentSprite.x += radius * (Math.random() - 0.5);
          ornamentSprite.y += radius * (Math.random() - 0.5);
        }
        ornamentSprite.scale.set(0);
        ornamentSprite.rotation =
          typeof ornament.rotation === 'number'
            ? (Math.random() - 0.5) * 2 * ornament.rotation
            : ornament.rotation === 'random'
              ? Math.random() * Math.PI * 2
              : ornament.rotation === 'pendulum'
                ? (Math.random() - 0.5) * 2 * degToRad(30)
                : 0;
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
