import CannonDebugger from 'cannon-es-debugger';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { Stage } from '../../core/stage/Stage';
import { KeyMap } from '../../libs/keyboard/KeyMap';
import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import { CannonManager } from './core/cannon/CannonManager';
import { PropObject, isProp } from './core/object/PropObject';
import { ScenarioManager } from './core/scenario/ScenarioManager';
import { Player } from './object/Player';
import { Wardrobe, isWardrobe } from './object/Wardrobe';

export default class WaffleRoomStage extends Stage {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  light?: THREE.DirectionalLight;
  controls?: OrbitControls;
  clock?: THREE.Clock;
  cannonDebugger?: { update: () => void };
  onAnimateCallbacks: ((time: DOMHighResTimeStamp) => void)[] = [];
  onUnmountCallbacks: (() => void)[] = [];

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
  }

  public mount() {
    // init scene

    this.renderer.setSize(this.app.clientWidth, this.app.clientHeight);
    this.scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    // init camera
    this.camera = new THREE.PerspectiveCamera(
      35,
      this.app.clientWidth / this.app.clientHeight,
      0.1,
      100,
    );
    this.camera.position.set(6, 4, 8);

    // sunlight
    const sunLight = new THREE.DirectionalLight('#ffffff', 4);

    sunLight.castShadow = true;
    sunLight.shadow.camera.far = 15;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.normalBias = 0.05;
    sunLight.position.set(3, 3, -2.25);

    // add objects
    this.scene.add(sunLight);
    this.scene.add(this.camera);

    // add controls & animation
    this.controls = new OrbitControls(
      this.camera,
      this.app.querySelector('canvas') as HTMLCanvasElement,
    );
    this.clock = new THREE.Clock();

    const resourceLoader = new ResourceLoader();
    const keyMap = new KeyMap();
    const scenarioManager = new ScenarioManager(this.renderer, this.camera);
    const cannonManager = new CannonManager();

    // Player
    const player = new Player(
      resourceLoader,
      keyMap,
      scenarioManager,
      cannonManager,
    );
    this.onAnimateCallbacks.push(player.onAnimate);
    this.onUnmountCallbacks.push(player.onUnmount);

    // Props

    resourceLoader.registerModel(
      'waffleRoom',
      '/models/WaffleRoom/WaffleRoom.gltf',
      {
        onLoad: ({ scene: room }) => {
          const scale = 4;
          room.scale.set(scale, scale, scale);
          this.scene?.add(room);
          room.traverse((child) => {
            if (isWardrobe(child)) {
              const wardrobe = new Wardrobe(
                child,
                resourceLoader,
                keyMap,
                scenarioManager,
                cannonManager,
              );
              this.onAnimateCallbacks.push(wardrobe.onAnimate);
              this.onUnmountCallbacks.push(wardrobe.onUnmount);
            }
            if (isProp(child)) new PropObject(child, cannonManager);
          });
        },
      },
    );
  }

  public resize() {
    // TODO: Update to common util function
    if (!this.camera) return;

    this.renderer.setSize(this.app.clientWidth, this.app.clientHeight);
    this.camera.aspect = this.app.clientWidth / this.app.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  public animate(t: number) {
    this.onAnimateCallbacks.forEach((callback) => callback(t));
  }

  public unmount() {
    // dispose objects
    this.scene?.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });

    this.onUnmountCallbacks.forEach((callback) => callback());

    // clear properties
    this.scene = undefined;
    this.camera = undefined;

    // done!
    console.log('TestBlueStage unmounted');
  }
}
