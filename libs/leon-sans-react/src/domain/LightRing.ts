import * as PIXI from 'pixi.js';

const BULB_POSITIONS = [
  { x: 55.12, y: 34.76 },
  { x: 13, y: 130 },
  { x: 51, y: 221 },
  { x: 140, y: 265 },
  { x: 232, y: 238 },
];

export default class LightRing {
  size: number = 300;
  radius: number = this.size / 2;
  bulbOnTexture: PIXI.Texture;
  bulbOffTexture: PIXI.Texture;
  bulbs: PIXI.Sprite[];
  container: PIXI.Container;

  constructor() {
    this.bulbOnTexture = PIXI.Texture.from(new URL(`../assets/ornaments/bulb_on.svg`, import.meta.url).href);
    this.bulbOffTexture = PIXI.Texture.from(new URL(`../assets/ornaments/bulb_off.svg`, import.meta.url).href);
    this.bulbs = [];
    this.container = new PIXI.Container();
    this.container.width = this.size;
    this.container.height = this.size;
    this.container.pivot.set(this.radius, 150);
    this.container.scale.set(0.94);

    const bulbCableTexture = PIXI.Texture.from(new URL(`../assets/ornaments/bulb_cable.svg`, import.meta.url).href);
    const bulbCable = new PIXI.Sprite(bulbCableTexture);
    bulbCable.anchor.set(0.5, 0.5);
    bulbCable.x = this.radius;
    bulbCable.y = this.radius;
    this.container.addChild(bulbCable);

    for (let i = 0; i < 5; i++) {
      const bulb = new PIXI.Sprite(this.bulbOffTexture);
      bulb.anchor.set(0.5, 0.5);
      bulb.x = BULB_POSITIONS[i].x + 10;
      bulb.y = BULB_POSITIONS[i].y + 10;
      this.bulbs.push(bulb);
      this.container.addChild(bulb);
    }
  }

  /**
   * 모든 전구를 켭니다.
   */
  turnOnEvery() {
    this.bulbs.forEach((bulb) => {
      bulb.texture = this.bulbOnTexture;
    });
  }

  /**
   * 모든 전구를 끕니다.
   */
  turnOffEvery() {
    this.bulbs.forEach((bulb) => {
      bulb.texture = this.bulbOffTexture;
    });
  }

  /**
   * 전구를 랜덤하게 켜거나 끕니다.
   */
  turnOnOffRandomly() {
    this.bulbs.forEach((bulb) => {
      const isOn = Math.random() > 0.5;
      bulb.texture = isOn ? this.bulbOnTexture : this.bulbOffTexture;
    });
  }
}