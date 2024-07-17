import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';

import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import { addBorderToMaterial, compositeImage, url } from '../../utils';
import {
  CubeObject,
  MapData,
  ModelObject,
  ModelOverride,
  Resource,
  mapDataSchema,
} from './map-schema';

export class World {
  scene: THREE.Scene;
  loader: ResourceLoader = new ResourceLoader();
  initialized = false;
  _onInitialized: () => void = () => {};

  set onInitialized(value: () => void) {
    this._onInitialized = value;
    if (this.initialized) {
      this._onInitialized();
    }
  }

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.init();
  }

  private init() {
    Promise.all([this.initMap(), this.initLight()]).then(() => {
      this.initialized = true;
      this._onInitialized();
    });
  }

  private async initMap() {
    const mapData: MapData = mapDataSchema.parse(
      (await import('./map.json')).default,
    );

    await this.loadResources(mapData.resources);
    await Promise.all(
      mapData.objects.map(async (mapObject) => {
        if (mapObject.type === 'cube') await this.initCube(mapObject);
        if (mapObject.type === 'model') await this.initModel(mapObject);
      }),
    );
  }

  private async loadResources(resources: Resource[]) {
    for (const resource of resources) {
      if (resource.type === 'texture')
        this.loader.registerTexture(resource.name, url(resource.path), {
          onLoad: (r) => (r.colorSpace = resource.colorSpace ?? ''),
        });
      else if (resource.type === 'gltf')
        this.loader.registerModel(resource.name, url(resource.path));
    }
    this.loader.loadAll();
    return await new Promise((r) => {
      this.loader.onLoadComplete = () => r(null);
    });
  }

  private async initCube(cubeObject: CubeObject) {
    const materialParams: THREE.MeshStandardMaterialParameters = {};

    if (cubeObject.texture !== undefined) {
      if (cubeObject.background) {
        const texture = this.loader.getTexture(cubeObject.texture)!;
        const compositeCanvas = compositeImage(
          cubeObject.background,
          texture.image,
        );
        materialParams.map = new THREE.CanvasTexture(compositeCanvas);
      } else {
        materialParams.map = this.loader.getTexture(cubeObject.texture);
      }
    } else {
      if (cubeObject.background === undefined) throw new Error('No texture');
      materialParams.color = new THREE.Color(cubeObject.background);
    }

    const [w, h, d] = cubeObject.size;
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshStandardMaterial(materialParams);
    const border = cubeObject.border;
    if (border) addBorderToMaterial(material, border.color, border.width);
    material.transparent = cubeObject.transparent;
    const cube = new THREE.Mesh(geometry, material);

    const positions = cubeObject.positions;
    for (const position of positions) {
      if (Array.isArray(position)) {
        const clone = cube.clone();
        clone.position.set(position[0], position[1], position[2]);
        this.scene.add(clone);
      } else {
        const step = position.step;
        const [x1, y1, z1] = position.start;
        const [x2, y2, z2] = position.end;

        for (let x = x1; x <= x2; x += step) {
          for (let y = y1; y <= y2; y += step) {
            for (let z = z1; z <= z2; z += step) {
              const clone = cube.clone();
              clone.position.set(x, y, z);
              this.scene.add(clone);
            }
          }
        }
      }
    }
  }

  private async initModel(modelObject: ModelObject) {
    const model = this.loader.getModel(modelObject.name);
    if (!model) return;

    modelObject.overrides?.forEach(this.overrideModel.bind(this, model));

    model.scene.position.set(...modelObject.position);
    this.scene.add(model.scene);
  }

  private overrideModel(model: GLTF, override: ModelOverride): void {
    const object = model.scene.getObjectByName(override.name) as THREE.Mesh;
    if (!object) return;
    if (override.material) {
      const params: any = {};
      for (const [param, arg] of Object.entries(override.material.args)) {
        if (arg.type === 'texture') {
          const texture = this.loader.getTexture(arg.name);
          params[param] = texture;
        } else {
          // primitive types
          params[param] = arg.value;
        }
      }
      object.material = new (THREE as any)[override.material.type](params);
    }
  }

  private async initLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);
    // const zDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    // zDirectionalLight.position.set(0, 15, 1270);
    // this.scene.add(zDirectionalLight);
    // const xDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    // xDirectionalLight.position.set(1270, 15, 0);
    // this.scene.add(xDirectionalLight);
  }

  public dispose() {
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        object.material.dispose();
      }
    });
  }
}
