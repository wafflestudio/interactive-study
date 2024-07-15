import gsap from 'gsap';
import * as THREE from 'three';

import { Stage } from '../../core/stage/Stage';
import { StageManager } from '../../core/stage/StageManager';
import { KeyMap } from '../../libs/keyboard/KeyMap';
import { pivotOnParentAxis, resize } from '../../utils';
import { World } from './World';

type UnmountedContext = {
  mounted: false;
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  world?: World;
};

type MountedContext = {
  mounted: true;
  scene: THREE.Scene;
  camera: THREE.Camera;
  world: World;
};

type Context = UnmountedContext | MountedContext;

export default class EscapeCubeStage extends Stage {
  context: Context;
  keymap: KeyMap;
  stageManager: StageManager;

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
    this.keymap = new KeyMap();
    this.context = { mounted: false };
    this.stageManager = StageManager.instance;
    this.initKeymap();
  }

  public mount() {
    this.createContext();
    this.resize();
    this.keymap.activate();
  }

  private createContext(): void {
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);
    const world = new World(scene);
    const h = 6;
    const camera = new THREE.OrthographicCamera(0, 0, h, -h, 1, 1000);
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 5, 0);
    scene.add(camera);
    this.context = { mounted: true, scene, camera, world };
  }

  private initKeymap(): void {
    let worldIsRotating = false;

    this.keymap.bind('->', () => {
      if (!this.context.mounted || worldIsRotating) return;
      this.pivotCameraAnimation(90);
    });

    this.keymap.bind('<-', () => {
      if (!this.context.mounted || worldIsRotating) return;
      this.pivotCameraAnimation(-90);
    });
  }

  private pivotCameraAnimation(angle: number) {
    const helper = { t: 0 };
    let prevT = 0;
    let duration = 1;

    const currentTween = gsap.to(helper, {
      id: 'pivot-camera',
      paused: true,
      t: 1,
      duration,
      onUpdate: ({ t }: typeof helper) => {
        if (!this.context.mounted) {
          gsap.getById('pivot-camera')?.kill();
          return;
        }
        const deltaT = t - prevT;
        prevT = t;
        pivotOnParentAxis(
          this.context.camera,
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 1, 0),
          angle * deltaT,
        );
      },
      onUpdateParams: [helper],
      data: helper,
    });

    currentTween.resume();
  }

  public animate() {
    if (!this.context.mounted || !this.context.world.initialized) return;
    this.renderer.render(this.context.scene, this.context.camera);
  }

  public resize() {
    if (!this.context.mounted) return;
    resize(
      this.renderer,
      this.context.camera,
      window.innerWidth,
      window.innerHeight,
    );
  }

  public unmount() {
    if (!this.context.mounted) return;
    this.context.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        object.material.dispose();
      }
    });
    this.keymap.deactivate();
  }
}
