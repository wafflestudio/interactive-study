import CannonDebugger from 'cannon-es-debugger';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { Stage } from '../../core/stage/Stage';
import { KeyMap } from '../../libs/keyboard/KeyMap';
import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import { CannonManager } from './core/cannon/CannonManager';
import { Dialogue } from './core/dialogue/Dialogue';
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
  onAnimateCallbacks: {
    cb: (time: DOMHighResTimeStamp) => void;
    bindTarget: any;
  }[] = [];
  onUnmountCallbacks: (() => void)[] = [];
  cannonManager?: CannonManager;

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
  }

  public mount() {
    /*
     * 1. init scene
     */
    this.renderer.setSize(this.app.clientWidth, this.app.clientHeight);
    this.scene = new THREE.Scene();

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

    // implement managers
    const scenarioManager = new ScenarioManager(this.renderer, this.camera);
    const resourceLoader = new ResourceLoader();
    const keyMap = new KeyMap();
    this.cannonManager = new CannonManager();
    const dialogue = new Dialogue({ app: this.app });

    // debug
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
    this.cannonDebugger = CannonDebugger(this.scene, this.cannonManager.world);

    scenarioManager.addPlot(
      'test',
      () => {
        dialogue.begin(['시작했습니다!', '메인으로 갑시다'], () => {
          scenarioManager.changePlot('main');
        });
      },
      () => {},
    );

    scenarioManager.addPlot(
      'main',
      () => {},
      () => {},
    );

    scenarioManager.addPlot(
      'test2',
      () => {},
      () => {},
    );

    scenarioManager.startPlot('test');

    /*
     * 2. load resources
     */
    // add controls & animation
    this.controls = new OrbitControls(
      this.camera,
      this.app.querySelector('canvas') as HTMLCanvasElement,
    );
    this.clock = new THREE.Clock();

    // Player
    const player = new Player(
      this.scene,
      resourceLoader,
      keyMap,
      scenarioManager,
      this.cannonManager,
    );
    this.onAnimateCallbacks.push({ cb: player.onAnimate, bindTarget: player });
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

          // wrap cannon body for all room objects
          const targetObjects: THREE.Object3D[] = [];
          room.traverse((child) => {
            child.type === 'Mesh' && targetObjects.push(child);
          });
          this.cannonManager?.wrap(targetObjects, scale, 0);

          // filter collision
          const filteredMap = new Map(
            [...this.cannonManager?.totalObjectMap!].filter(
              ([key]) => key != 'Scene',
            ),
          );
          filteredMap.forEach(({ body }) => {
            this.cannonManager?.filterCollision(body, 4, 8);
          });

          // specify interactive objects (temp: only wardrobe for now)
          const wardrobeInfo =
            this.cannonManager?.totalObjectMap.get('큐브010');
          const wardrobe = new Wardrobe(
            wardrobeInfo!.mesh,
            wardrobeInfo!.body,
            resourceLoader,
            keyMap,
            scenarioManager,
            this.cannonManager!,
          );
          this.onAnimateCallbacks.push({
            cb: wardrobe.onAnimate,
            bindTarget: wardrobe,
          });
          this.onUnmountCallbacks.push(wardrobe.onUnmount);
          this.cannonManager?.filterCollision(wardrobeInfo!.body, 2, 1);
        },
      },
    );

    // temp
    keyMap.bind('Space', () => {
      dialogue.next();
    });

    /*
     * 3. activate
     */
    resourceLoader.loadAll();
    keyMap.activate();
  }

  public resize() {
    // TODO: Update to common util function
    if (!this.camera) return;

    this.renderer.setSize(this.app.clientWidth, this.app.clientHeight);
    this.camera.aspect = this.app.clientWidth / this.app.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  public animate(t: DOMHighResTimeStamp) {
    if (
      !this.scene ||
      !this.camera ||
      !this.controls ||
      !this.clock ||
      !this.cannonManager
    )
      return;

    this.onAnimateCallbacks.forEach(({ cb, bindTarget }) =>
      cb.bind(bindTarget)(t),
    );

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    const delta = this.clock.getDelta();

    this.cannonManager.world.step(1 / 60, delta, 3);
    this.cannonManager.renderMovement();
    this.cannonManager.stopIfCollided();
    this.cannonDebugger?.update();
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
