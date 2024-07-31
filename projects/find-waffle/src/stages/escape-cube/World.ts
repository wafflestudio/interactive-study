import * as CANNON from 'cannon-es';
import gsap from 'gsap';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';

import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import { addBorderToMaterial, compositeImage, url } from '../../utils';
import { Player } from './Player';
import { Timer } from './Timer';
import {
  CubeObject,
  MapData,
  ModelObject,
  ModelOverride,
  Resource,
  mapDataSchema,
} from './map-schema';

const TIMER_START_QUATERNION = new THREE.Quaternion().setFromAxisAngle(
  new THREE.Vector3(0, 1, 0),
  Math.PI,
);

export class World {
  cannonWorld = new CANNON.World();
  scene: THREE.Scene;
  loader: ResourceLoader = new ResourceLoader();
  map: THREE.Group = new THREE.Group();
  mapBody: CANNON.Body = new CANNON.Body({ mass: 0 });
  player: Player;
  timer?: Timer;
  initialized = false;
  isRotating = false;
  _onInitialized: () => void = () => {};

  set onInitialized(value: () => void) {
    this._onInitialized = value;
    if (this.initialized) {
      this._onInitialized();
    }
  }

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    scene.add(this.map);
    this.cannonWorld.addBody(this.mapBody);
    this.player = new Player(this);
    this.initCannonWorld();
    this.init();
  }

  private initCannonWorld() {
    this.cannonWorld.broadphase = new CANNON.NaiveBroadphase();
    (this.cannonWorld.solver as CANNON.GSSolver).iterations = 10;
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
    this.initTimer();
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
      else if (resource.type === 'font')
        this.loader.registerFont(resource.name, url(resource.path));
    }
    this.loader.loadAll();
    return await new Promise((r) => {
      this.loader.onLoadComplete = () => r(null);
    });
  }

  private initTimer() {
    this.timer = new Timer(this.loader.getFont('helvetiker')!, this);
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
        this.map.add(clone);
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
              this.map.add(clone);
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
    this.map.add(model.scene);

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

  private async initLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.map.add(ambientLight);
    const sunLight1 = new THREE.DirectionalLight(0xffffff, 0.7);
    sunLight1.position.set(-1270, 15, 1270);
    this.map.add(sunLight1);
    const sunLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
    sunLight2.position.set(1270, 15, 1270);
    this.map.add(sunLight2);
  }

  public dispose() {
    this.map.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        object.material.dispose();
      }
    });
    this.player.dispose();
  }

  public animate(timeDelta: number) {
    this.player.animate();
    this.cannonWorld.step(1 / 60, timeDelta);
    this.timer?.pass(timeDelta);
  }

  public rotate(axis: THREE.Vector3, angle: number) {
    if (this.isRotating) return;
    this.isRotating = true;
    this.pause();
    const helper = { t: 0 };
    const start = this.map.quaternion.clone();
    const rotation = new THREE.Quaternion().setFromAxisAngle(
      axis,
      THREE.MathUtils.degToRad(angle),
    );
    const dest = start.clone().multiply(rotation).normalize();
    gsap.to(helper, {
      t: 1,
      duration: 1,
      onUpdate: ({ t }: typeof helper) => {
        const q = start.clone().slerp(dest, t);
        this.map.quaternion.copy(q);
        this.mapBody.quaternion.copy(new CANNON.Quaternion(q.x, q.y, q.z, q.w));
      },
      onUpdateParams: [helper],
      onComplete: () => {
        if (this.map.quaternion.angleTo(TIMER_START_QUATERNION) < 0.01) {
          this.timer?.start();
        }
        this.isRotating = false;
        this.resume();
      },
    });
  }

  public pause() {
    this.player.pause();
  }

  public resume() {
    this.player.resume();
  }
}
