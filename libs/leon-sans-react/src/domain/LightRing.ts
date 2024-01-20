import * as PIXI from 'pixi.js';

const BULB_POSITIONS = [
  { x: -85, y: -110 },
  { x: -87, y: -40 },
  { x: -50, y: 30 },
  { x: 5, y: 90 },
  { x: 85, y: 110 },
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

    const bulbCableTexture = PIXI.Texture.from('ornaments/bulb_cable.svg');
    const bulbCable = new PIXI.Sprite(bulbCableTexture);
    bulbCable.anchor.set(0.5);
    bulbCable.name = 'bulb_cable';
    this.container.addChild(bulbCable);

    for (let i = 0; i < 5; i++) {
      const bulb = new PIXI.Sprite(this.bulbOffTexture);
      bulb.name = `bulb_${i}`;
      bulb.anchor.set(0.5);
      bulb.x = BULB_POSITIONS[i].x;
      bulb.y = BULB_POSITIONS[i].y;
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