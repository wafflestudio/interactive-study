import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { Stage } from '../../core/stage/Stage';
import { KeyMap } from '../../libs/keyboard/KeyMap.ts';
import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import Cannon from './Cannon.ts';
import { animateCharacter } from './animation/character.ts';
import { Dialogue } from './dialogue/Dialogue.ts';

export default class WaffleRoomStage extends Stage {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  onKeyDown?: (e: KeyboardEvent) => void;
  light?: THREE.DirectionalLight;
  controls?: OrbitControls;
  clock?: THREE.Clock;
  world?: CANNON.World;
  cannonDebugger?: { update: () => void };
  character?: THREE.Object3D;
  characterBody?: CANNON.Body;
  wallBody?: CANNON.Body;
  cannon: Cannon = new Cannon();
  keysPressed: Map<string, boolean> = new Map();
  dialogue?: Dialogue;

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

    // initialize cannon-es debugger
    this.cannonDebugger = CannonDebugger(this.scene, this.cannon.world);

    // add objects
    this.scene.add(sunLight);
    this.scene.add(this.camera);

    // add controls & animation
    this.controls = new OrbitControls(
      this.camera,
      this.app.querySelector('canvas') as HTMLCanvasElement,
    );
    this.clock = new THREE.Clock();

    // init dialogue
    this.dialogue = new Dialogue({ app: this.app });

    // load resources
    const resourceLoader = new ResourceLoader();
    resourceLoader.registerModel('iceCream', '/models/IceCream/iceice.glb', {
      onLoad: ({ scene: iceCream }) => {
        const scale = 0.005;
        const position = new THREE.Vector3(2, 0, 2);

        iceCream.position.set(position.x, position.y, position.z);
        const body = this.cannon.wrap([iceCream], scale, 1, position, true);
        this.cannon.bodies[0].mesh.name = 'iceCream';

        this.character = iceCream;
        this.characterBody = body[0];
        // TODO: Add Keymap
        const keyMap = new KeyMap();
        keyMap.bind(
          'w',
          () => this.keysPressed.set('up', true),
          () => this.keysPressed.delete('up'),
        );
        keyMap.bind(
          's',
          () => this.keysPressed.set('down', true),
          () => this.keysPressed.delete('down'),
        );
        keyMap.bind(
          'a',
          () => this.keysPressed.set('left', true),
          () => this.keysPressed.delete('left'),
        );
        keyMap.bind(
          'd',
          () => this.keysPressed.set('right', true),
          () => this.keysPressed.delete('right'),
        );
        keyMap.bind('Space', () => {
          this.dialogue?.next();
        });

        keyMap.activate();

        iceCream.scale.set(scale, scale, scale);

        this.scene?.add(iceCream);

        // start dialogue
        this.dialogue?.begin(['안녕하세요!', '저는 아이스크림입니다.'], () => {
          console.log('end dialogue');
        });
      },
    });
    resourceLoader.registerModel(
      'waffleRoom',
      '/models/WaffleRoom/WaffleRoom.gltf',
      {
        onLoad: ({ scene: room }) => {
          const scale = 4;
          const targetObjects: THREE.Object3D[] = [];
          room.traverse((child) => {
            if (child.type === 'Mesh') {
              targetObjects.push(child);
            }
          });
          this.cannon.wrap(targetObjects, scale, 0);
          room.scale.set(scale, scale, scale);
          this.scene?.add(room);

          const meshNameList = [
            '큐브011',
            '큐브012',
            '큐브101',
            '큐브010',
            '큐브093',
            '큐브096',
            '큐브114',
            '큐브111',
          ];

          this.cannon.bodies.forEach(({ body, mesh }) => {
            if (meshNameList.includes(mesh.name)) {
              // mesh.material.color = new THREE.Color(0xff0000);
              this.cannon.filterCollision(body, 2, 1);
              console.log(body);
            } else if (mesh.name === 'iceCream') {
              console.log(body.position);
              body.linearDamping = 0.9;
              body.angularDamping = 0.9;
              this.cannon.filterCollision(body, 1, 2);
            } else {
              this.cannon.filterCollision(body, 4, 8);
            }
          });
          this.cannon.bodies.forEach(({ body, mesh }) => {
            if (mesh.name === '큐브114') {
              this.cannon.createInteractiveHitbox(mesh, 0.2);
            }
          });
        },
      },
    );
    resourceLoader.loadAll();
  }

  public animate(): void {
    if (
      !this.scene ||
      !this.camera ||
      !this.controls ||
      !this.clock ||
      !this.character ||
      !this.characterBody
    )
      return;

    animateCharacter(this.characterBody, this.keysPressed);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    const delta = this.clock.getDelta();

    this.cannon.world.step(1 / 60, delta, 3);
    this.cannon.renderMovement();
    this.cannon.stopIfCollided();
    this.cannonDebugger?.update();
  }

  public resize() {
    // TODO: Update to common util function
    if (!this.camera) return;

    this.renderer.setSize(this.app.clientWidth, this.app.clientHeight);
    this.camera.aspect = this.app.clientWidth / this.app.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  public unmount() {
    // dispose objects
    this.scene?.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });

    // clear properties
    this.scene = undefined;
    this.camera = undefined;

    // remove key mapping
    if (this.onKeyDown) window.removeEventListener('keydown', this.onKeyDown);

    // done!
    console.log('TestBlueStage unmounted');
  }
}
