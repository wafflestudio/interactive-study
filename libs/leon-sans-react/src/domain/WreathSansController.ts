import gsap, { Power0, Power3 } from 'gsap';
import { Align, CHARSET, ModelData } from 'leonsans';
import LeonSans from 'leonsans/src/leonsans';
import * as PIXI from 'pixi.js';

import { degToRad, randomIdx } from '../utils';
import LightRing from './LightRing';
import Ornament from './Ornament';
import { ORNAMENT_DATA } from './OrnamentData';

const TYPO_EASING = Power0.easeNone;
const TYPO_DRAWING_DURATION = 1;

const LEAVES_EASING = Power3.easeOut;
const LEAVES_DRAWING_SPEED = 1;
const LEAVES_DRAWING_DELAY = TYPO_DRAWING_DURATION - 0.05;

type WreathSansProps = {
  canvas: HTMLCanvasElement;
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  graphics: PIXI.Graphics;
  leon: LeonSans;
  darkMode?: boolean;
};

export default class WreathSansController {
  canvas: HTMLCanvasElement;
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  graphics: PIXI.Graphics;
  leon: LeonSans;
  leafGap: number = 10;
  leafLightRingRatio: number = 3;
  ornamentDisabled: boolean = false;
  ornamentOrder: string[] = [];
  ornamentDensity: number = 5;
  ornamentAmplitude: number = 30;
  darkMode: boolean;

  leafSources: PIXI.SpriteSource[];
  darkLeafSources: PIXI.SpriteSource[];
  ornamentMap: Record<string, Ornament>;
  containers: PIXI.Container[];
  loaded: boolean;
  loadingPromise: Promise<void>;

  constructor(props: WreathSansProps) {
    this.canvas = props.renderer.view as HTMLCanvasElement;
    this.renderer = props.renderer;
    this.stage = props.stage;
    this.graphics = props.graphics;
    this.leon = props.leon;
    this.darkMode = props.darkMode ?? false;

    this.containers = [];
    this.leafSources = [];
    this.darkLeafSources = [];
    this.ornamentMap = {};
    this.loaded = false;
    this.loadingPromise = this.loadAssets().then(() => {
      this.loaded = true;
    });
  }

  get align() {
    return this.leon.align;
  }

  set align(align: Align) {
    this.leon.align = align;
    this.updatePositions();
  }

  insertText(text: string, idx: number) {
    // check text
    if (text.length !== 1 || !(CHARSET.includes(text) || ' \n'.includes(text)))
      return;

    // add text
    this.leon.text =
      this.leon.text.slice(0, idx) + text + this.leon.text.slice(idx);

    // update paths
    this.updateLeonPosition();

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
    this.updateLeonPosition();

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
    this.updateLeonPosition();

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

  resize(width: number, height: number) {
    this.renderer.resize(width, height);
    this.updateLeonPosition();
    this.updatePositions();
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

  updateLeonPosition() {
    // recalculate position of new text
    const x = (this.canvas.clientWidth - this.leon.rect.w) / 2;
    const y = (this.canvas.clientHeight - this.leon.rect.h) / 2;
    this.leon.position(x, y);
    this.leon.updateDrawingPaths();
  }

  private async loadAssets() {
    for (let i = 1; i <= 20; i++) {
      const leaf = await PIXI.Assets.load<PIXI.SpriteSource>(
        `leaves/leaf_${i}.svg`,
      );
      this.leafSources.push(leaf);
    }

    for (let i = 1; i <= 20; i++) {
      const leaf = await PIXI.Assets.load<PIXI.SpriteSource>(
        `leaves_dark/leaf_${i}.svg`,
      );
      this.darkLeafSources.push(leaf);
    }

    // save ornament
    for (const [name, ornamentProp] of Object.entries(ORNAMENT_DATA)) {
      const ornament = await Ornament.load(ornamentProp);
      this.ornamentMap[name] = ornament;
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
    this.containers.slice(start, end).forEach((c) => c.destroy({children: true}));
    this.containers = [
      ...this.containers.slice(0, start),
      ...this.containers.slice(end),
    ];
  }

  private drawLeaves(idx: number = this.containers.length) {
    const typo = this.leon.data[idx];
    const container = this.makeContainer(idx);
    const startIdx = Math.floor(this.leafGap / 2);
    typo.drawingPaths
      .filter((pos) => pos.type !== 'a')
      .filter((_, i) => i % this.leafGap === startIdx)
      .forEach((pos, i, every) => {
        const leafAndRingContainer = new PIXI.Container();

        // make light ring
        if (i % this.leafLightRingRatio === 1) {
          const prevPos = every[i - 1];
          const displacement = {
            x: pos.x - prevPos.x,
            y: pos.y - prevPos.y,
          };

          const lightRing = new LightRing();
          const randomOnOffLightRing = () => {
            if (lightRing.container.destroyed) return;
            lightRing.turnOnOffRandomly();
            setTimeout(randomOnOffLightRing, Math.random() * 1000 + 1000);
          }
          randomOnOffLightRing();
          lightRing.container.rotation = Math.atan2(
            displacement.y,
            displacement.x,
          );

          const lightRingRotationDelta = (Math.random() - 0.5) * degToRad(30);
          lightRing.container.rotation += lightRingRotationDelta;

          leafAndRingContainer.addChild(lightRing.container);
        }

        // make leaf
        const source = this.darkMode
          ? this.darkLeafSources[randomIdx(this.darkLeafSources)]
          : this.leafSources[randomIdx(this.leafSources)];
        const leafSprite = PIXI.Sprite.from(source);
        leafSprite.anchor.set(0.5);

        leafAndRingContainer.addChild(leafSprite);
        container.addChild(leafAndRingContainer);

        leafAndRingContainer.x = pos.x - typo.rect.x;
        leafAndRingContainer.y = pos.y - typo.rect.y;

        const scale = this.leon.scale * 0.3;
        gsap.fromTo(
          leafAndRingContainer.scale,
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
    if (this.ornamentDisabled) return;
    let probability = 0;
    let ornamentIdx = -1;
    typo.drawingPaths
      .filter((pos, i) => pos.type == 'a' || i % 11 > 6)
      .forEach((pos, i, every) => {
        const isStar = pos.type === 'a';

        if (!isStar && this.ornamentDensity > probability) {
          probability++;
          return;
        }
        ornamentIdx = (ornamentIdx + 1) % this.ornamentOrder.length;
        probability = 0;

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
         * 그 외에는 접선의 수직 방향으로 x, y 오프셋을 줘서 자연스럽게
         */
        if (isStar) {
          ornamentSprite.y -= 7 * this.leon.scale;
        } else {
          const prevPos = every[i - 1];
          // 변위
          const displacement = {
            x: pos.x - prevPos.x,
            y: pos.y - prevPos.y,
          };
          // 거리
          const distance = Math.sqrt(displacement.x ** 2 + displacement.y ** 2);
          // 변위와 나란한 단위 벡터
          const tangentialUnitVector = {
            x: displacement.x / Math.sqrt(distance),
            y: displacement.y / Math.sqrt(distance),
          };
          // 변위와 수직한 단위 벡터
          const orthogonalUnitVector = {
            x: -tangentialUnitVector.y,
            y: tangentialUnitVector.x,
          };
          // 변위의 수직 방향으로 랜덤 오프셋
          const ornamentOffset =
            this.leon.scale * this.ornamentAmplitude * (Math.random() - 0.5);
          ornamentSprite.x += ornamentOffset * orthogonalUnitVector.x;
          ornamentSprite.y += ornamentOffset * orthogonalUnitVector.y;
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
