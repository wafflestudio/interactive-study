import * as THREE from 'three';

import { Stage } from '../../core/stage/Stage';
import { StageManager } from '../../core/stage/StageManager';
import { KeyMap } from '../../libs/keyboard/KeyMap';
import { resize } from '../../utils';
import { StageDebugger } from './StageDebugger';
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
    const world = new World(scene);
    const h = 7;
    const camera = new THREE.OrthographicCamera(0, 0, h, -h, 1, 1000);
    camera.position.set(0, 0, 15);
    scene.add(camera);
    scene.background = new THREE.Color('rgb(35, 110, 138)');

    if (window.location.hash === '#debug') {
      StageDebugger.init(world, camera, this.renderer.domElement);
    }

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
        const player = this.context.world!.player;
        player.setDirection({ x: 1 });
      },
      () => {
        const player = this.context.world!.player;
        if (this.keymap.pressedKeys.has('ArrowLeft')) {
          player.setDirection({ x: -1 });
        } else {
          player.setDirection({ x: 0 });
        }
      },
    );

    this.keymap.bind(
      '<-',
      () => {
        const player = this.context.world!.player;
        player.setDirection({ x: -1 });
      },
      () => {
        const player = this.context.world!.player;
        if (this.keymap.pressedKeys.has('ArrowRight')) {
          player.setDirection({ x: 1 });
        } else {
          player.setDirection({ x: 0 });
        }
      },
    );
    this.keymap.bind(
      '↑',
      () => {
        const player = this.context.world!.player;
        player.setDirection({ y: 1 });
      },
      () => {
        const player = this.context.world!.player;
        if (this.keymap.pressedKeys.has('ArrowDown')) {
          player.setDirection({ y: -1 });
        } else {
          player.setDirection({ y: 0 });
        }
      },
    );
    this.keymap.bind(
      '↓',
      () => {
        const player = this.context.world!.player;
        player.setDirection({ y: -1 });
      },
      () => {
        const player = this.context.world!.player;
        if (this.keymap.pressedKeys.has('ArrowUp')) {
          player.setDirection({ y: 1 });
        } else {
          player.setDirection({ y: 0 });
        }
      },
    );
  }

  public animate(timeDelta: number) {
    if (!this.context.mounted || !this.context.world.initialized) return;
    this.context.world.animate(timeDelta);
    StageDebugger.animate();
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
