import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import {
  RESOURCE_KEY_CLOUD,
  RESOURCE_KEY_GOOSE1,
  RESOURCE_KEY_GOOSE2,
  RESOURCE_KEY_GOOSE3,
  RESOURCE_KEY_GOOSE4,
  RESOURCE_KEY_HILL,
  RESOURCE_KEY_ICON1,
} from './constant';

export class GooseResourceLoader {
  loader = new ResourceLoader();
  onLoad: () => void = () => {};

  loadAll() {
    this.loader.registerModel(RESOURCE_KEY_HILL, '/goose/hill.glb');
    this.loader.registerModel(RESOURCE_KEY_CLOUD, '/goose/cloud.glb');
    this.loader.registerTexture(RESOURCE_KEY_ICON1, '/goose/computer.png');
    this.loader.registerTexture(RESOURCE_KEY_GOOSE1, '/goose/goose1.png');
    this.loader.registerTexture(RESOURCE_KEY_GOOSE2, '/goose/goose2.png');
    this.loader.registerTexture(RESOURCE_KEY_GOOSE3, '/goose/goose3.png');
    this.loader.registerTexture(RESOURCE_KEY_GOOSE4, '/goose/goose4.png');
    this.loader.onLoadComplete = this.onLoad;
    this.loader.loadAll();
  }
}
