import * as PIXI from 'pixi.js';

type OrnamentRoation = 'random' | 'pendulum' | 'none' | number;


type OrnamentProps = {
  name: string;
  source: PIXI.SpriteSource;
  rotation?: OrnamentRoation;
  scale?: number;
};

export type OrnamentLoadProps = Exclude<OrnamentProps, 'source'> & {
  path: string;
};

export default class Ornament {
  name: string;
  source: PIXI.SpriteSource;
  rotation: OrnamentRoation;
  scale: number;

  constructor({
    name,
    source,
    rotation = 'random',
    scale = 0.28,
  }: OrnamentProps) {
    this.name = name;
    this.source = source;
    this.rotation = rotation;
    this.scale = scale;
  }

  static async load({ name, path, rotation, scale }: OrnamentLoadProps) {
    const source = await PIXI.Assets.load(path);
    return new Ornament({ name, source, rotation, scale });
  }
}
