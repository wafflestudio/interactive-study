import * as THREE from 'three';

import { Stage } from '../../core/stage/Stage';
import { StageManager } from '../../core/stage/StageManager';
import { KeyMap } from '../../libs/keyboard/KeyMap';
import { resize } from '../../utils';
import { World } from './World';

type ContextVariables = {
  scene: THREE.Scene;
  camera: THREE.Camera;
  world: World;
  worldIsRotating: boolean;
};

type UnmountedContext = {
  mounted: false;
} & Partial<ContextVariables>;

type MountedContext = {
  mounted: true;
} & ContextVariables;

type Context = UnmountedContext | MountedContext;

export default class EscapeCubeStage extends Stage {
  context: Context;
  keymap: KeyMap;
  stageManager: StageManager;
  prevTime?: number;

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
    this.context = {
      mounted: true,
      scene,
      camera,
      world,
      worldIsRotating: false,
    };
  }

  private initKeymap(): void {
    this.keymap.bind(
      '->',
      () => {
        if (!this.context.mounted || !this.context.world.player) return;
        const player = this.context.world.player;
        player.direction.x = 1;
      },
      () => {
        if (!this.context.mounted || !this.context.world.player) return;
        const player = this.context.world.player;
        if (this.keymap.pressedKeys.has('ArrowLeft')) {
          player.direction.x = -1;
        } else {
          player.direction.x = 0;
        }
      },
    );

    this.keymap.bind(
      '<-',
      () => {
        if (!this.context.mounted || !this.context.world.player) return;
        const player = this.context.world.player;
        player.direction.x = -1;
      },
      () => {
        if (!this.context.mounted || !this.context.world.player) return;
        const player = this.context.world.player;
        if (this.keymap.pressedKeys.has('ArrowRight')) {
          player.direction.x = 1;
        } else {
          player.direction.x = 0;
        }
      },
    );
    this.keymap.bind(
      '↑',
      () => {
        if (!this.context.mounted || !this.context.world.player) return;
        const player = this.context.world.player;
        player.direction.y = 1;
      },
      () => {
        if (!this.context.mounted || !this.context.world.player) return;
        const player = this.context.world.player;
        if (this.keymap.pressedKeys.has('ArrowDown')) {
          player.direction.y = -1;
        } else {
          player.direction.y = 0;
        }
      },
    );
    this.keymap.bind(
      '↓',
      () => {
        if (!this.context.mounted || !this.context.world.player) return;
        const player = this.context.world.player;
        player.direction.y = -1;
      },
      () => {
        if (!this.context.mounted || !this.context.world.player) return;
        const player = this.context.world.player;
        if (this.keymap.pressedKeys.has('ArrowUp')) {
          player.direction.y = 1;
        } else {
          player.direction.y = 0;
        }
      },
    );
  }

  public animate(time: DOMHighResTimeStamp) {
    const prevTime = this.prevTime;
    this.prevTime = time;
    if (!prevTime || !this.context.mounted || !this.context.world.initialized)
      return;
    const deltaSeconds = (time - prevTime) / 1000;
    this.context.world.update(deltaSeconds);
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
