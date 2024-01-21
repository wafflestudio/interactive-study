import * as PIXI from 'pixi.js';

const BULB_POSITIONS = [
  { x: 37.27, y: 26.61 },
  { x: -3.73, y: 133.29 },
  { x: 35.24, y: 228.85 },
  { x: 123.27, y: 281.13 },
  { x: 235.27, y: 261.13 },
];

export default class LightRing {
  bulbOnTexture: PIXI.Texture;
  bulbOffTexture: PIXI.Texture;
  bulbs: PIXI.Sprite[];
  container: PIXI.Container;

  constructor() {
    this.bulbOnTexture = PIXI.Texture.from('ornaments/bulb_on.svg');
    this.bulbOffTexture = PIXI.Texture.from('ornaments/bulb_off.svg');
    this.bulbs = [];
    this.container = new PIXI.Container();
    this.container.width = 300;
    this.container.height = 300;
    this.container.pivot.set(150, 150);

    const bulbCableTexture = PIXI.Texture.from('ornaments/bulb_cable.svg');
    const bulbCable = new PIXI.Sprite(bulbCableTexture);
    // bulbCable.anchor.set(0.5, 0.5);
    bulbCable.x = 6.21;
    bulbCable.y = 6.21;
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