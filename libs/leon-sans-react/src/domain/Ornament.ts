import * as PIXI from 'pixi.js';

type OrnamentRoation = 'random' | 'pendulum' | 'none' | number;

type OrnamentProps = {
  source: PIXI.SpriteSource;
  rotation?: OrnamentRoation;
  scale?: number;
};

export type OrnamentLoadProps = Omit<OrnamentProps, 'source'> & {
  path: string;
};

export default class Ornament {
  source: PIXI.SpriteSource;
  rotation: OrnamentRoation;
  scale: number;

  constructor({
    source,
    rotation = 'random',
    scale = 0.28,
  }: OrnamentProps) {
    this.source = source;
    this.rotation = rotation;
    this.scale = scale;
  }

  static async load({ path, rotation, scale }: OrnamentLoadProps) {
    const source = await PIXI.Assets.load(path);
    return new Ornament({ source, rotation, scale });
  }
}
