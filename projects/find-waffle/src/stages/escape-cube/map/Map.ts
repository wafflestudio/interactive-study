import * as CANNON from 'cannon-es';
import { noop } from 'es-toolkit';
import gsap from 'gsap';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';

import { addBorderToMaterial, compositeImage, url } from '../../../utils';
import { World } from '../World';
import {
  CubeObject,
  MapData,
  ModelObject,
  ModelOverride,
  Resource,
  mapDataSchema,
} from './map-schema';

export class Map {
  mapObject: THREE.Group = new THREE.Group();
  mapBody: CANNON.Body = new CANNON.Body({ mass: 0 });
  isRotating = false;

  constructor(public world: World) {
    this.world.cannonWorld.addBody(this.mapBody);
    this.world.scene.add(this.mapObject);
  }

  get loader() {
    return this.world.loader;
  }

  get scene() {
    return this.world.scene;
  }

  public async init() {
    this.initLight();
    await this.initMap();
  }

  private async loadResources(resources: Resource[]) {
    for (const resource of resources) {
      if (resource.type === 'texture')
        this.loader.registerTexture(resource.name, url(resource.path), {
          onLoad: (r) => (r.colorSpace = resource.colorSpace ?? ''),
        });
      else if (resource.type === 'gltf')
        this.loader.registerModel(resource.name, url(resource.path));
      else if (resource.type === 'font')
        this.loader.registerFont(resource.name, url(resource.path));
    }
    this.loader.loadAll();
    return await new Promise((r) => {
      this.loader.onLoadComplete = () => r(null);
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

  private initLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.mapObject.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(0, 5, 15);
    sunLight.lookAt(0, 0, 0);
    this.world.scene.add(sunLight);
  }

  public dispose() {
    this.mapObject.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        object.material.dispose();
      }
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
        this.mapObject.add(clone);
        this.addMapShape(position, [w, h, d]);
      } else {
        const step = position.step;
        const [x1, y1, z1] = position.start;
        const [x2, y2, z2] = position.end;

        for (let x = x1; x <= x2; x += step) {
          for (let y = y1; y <= y2; y += step) {
            for (let z = z1; z <= z2; z += step) {
              const clone = cube.clone();
              clone.position.set(x, y, z);
              this.mapObject.add(clone);
              this.addMapShape([x, y, z], [w, h, d]);
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
    model.scene.quaternion.setFromEuler(
      new THREE.Euler(...modelObject.rotation.map(THREE.MathUtils.degToRad)),
    );
    model.scene.scale.setScalar(modelObject.scale);
    this.mapObject.add(model.scene);

    if (modelObject.shapes) {
      for (const shape of modelObject.shapes) {
        const shapePosition: [number, number, number] = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
          shapePosition[i] =
            shape.position[i] + modelObject.position[i] + shape.size[i] / 2;
        }
        this.addMapShape(shapePosition, shape.size);
      }
    }
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

  private addMapShape(
    position: [number, number, number],
    size: [number, number, number],
  ) {
    const shape = new CANNON.Box(new CANNON.Vec3(...size.map((s) => s / 2)));
    this.mapBody.addShape(shape, new CANNON.Vec3(...position));
  }

  public rotate(axis: THREE.Vector3, angle: number): gsap.core.Tween {
    if (this.isRotating) return gsap.delayedCall(0, noop);
    this.isRotating = true;
    this.world.pause();
    const helper = { t: 0 };
    const start = this.mapObject.quaternion.clone();
    const rotation = new THREE.Quaternion().setFromAxisAngle(
      axis,
      THREE.MathUtils.degToRad(angle),
    );
    const dest = start.clone().multiply(rotation).normalize();
    return gsap.to(helper, {
      t: 1,
      duration: 1,
      onUpdate: ({ t }: typeof helper) => {
        const q = start.clone().slerp(dest, t);
        this.mapObject.quaternion.copy(q);
        this.mapBody.quaternion.copy(new CANNON.Quaternion(q.x, q.y, q.z, q.w));
      },
      onUpdateParams: [helper],
      onComplete: () => {
        this.isRotating = false;
        if (!this.world.timer?.paused) this.world.resume();
      },
    });
  }

  public add(obj: THREE.Object3D) {
    this.mapObject.add(obj);
  }
}
