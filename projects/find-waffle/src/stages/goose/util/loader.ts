import { Font, FontLoader } from 'three/examples/jsm/Addons.js';

import { ResourceLoader } from '../../../libs/resource-loader/ResourceLoader';

export const HILL_KEY = 'hill';
export const CLOUD_KEY = 'cloud';

export const CD_KEY = 'cd';
export const FOLDER_KEY = 'folder';
export const MEMO_KEY = 'memo';

export const GOOSE1_KEY = 'goose1';
export const GOOSE2_KEY = 'goose2';
export const GOOSE3_KEY = 'goose3';
export const GOOSE4_KEY = 'goose4';
export const GOOSE_LOVE = 'gooselove';

export const WAFFLE_MIX_KEY = 'wafflemix';
export const WAFFLE_MAKER_KEY = 'wafflemaker';
export const WAFFLE_KEY = 'waffle';

export class GooseResourceLoader extends ResourceLoader {
  loadAll() {
    this.registerModel(HILL_KEY, '/goose/hill.glb');
    this.registerModel(CLOUD_KEY, '/goose/cloud.glb');

    this.registerTexture(CD_KEY, '/goose/cd.png');
    this.registerTexture(FOLDER_KEY, '/goose/folder.png');
    this.registerModel(MEMO_KEY, '/goose/memo.glb');

    this.registerTexture(GOOSE1_KEY, '/goose/goose1.png');
    this.registerTexture(GOOSE2_KEY, '/goose/goose2.png');
    this.registerTexture(GOOSE3_KEY, '/goose/goose3.png');
    this.registerTexture(GOOSE4_KEY, '/goose/goose4.png');
    this.registerTexture(GOOSE_LOVE, '/goose/love.png');

    this.registerModel(WAFFLE_MIX_KEY, '/goose/wafflemix.glb');
    this.registerModel(WAFFLE_MAKER_KEY, '/goose/wafflemaker.glb');
    this.registerModel(WAFFLE_KEY, '/goose/waffle.glb');

    super.loadAll();
  }

  getModelObject(key: string) {
    return this.getModel(key)?.scene.children[0];
  }

  loadGooseTextures() {
    return [GOOSE1_KEY, GOOSE2_KEY, GOOSE3_KEY, GOOSE4_KEY]
      .map((key) => this.getTexture(key))
      .filter((x) => x !== undefined);
  }
}

const loader = new FontLoader();

export const loadFont = (src: string): Promise<Font> =>
  new Promise((res) => {
    loader.load(src, (font) => {
      res(font);
    });
  });
