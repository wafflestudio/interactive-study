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
import { animation } from './temp/walk';

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
  // foxBody?: CANNON.Body;
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

    // cannon setting
    // this.world.gravity.set(0, -9.82, 0);
    // const defaultMaterial = new CANNON.Material('default');
    // const wallMaterial = new CANNON.ContactMaterial(
    //   defaultMaterial,
    //   defaultMaterial,
    //   {
    //     friction: 0.1,
    //     restitution: 0.9,
    //   },
    // );
    // this.wallBody = new CANNON.Body({
    //   mass: 0,
    //   position: new CANNON.Vec3(1.2, 1.6, -1.2),
    //   shape: new CANNON.Box(new CANNON.Vec3(2.5, 2.3, 0.2)),
    //   material: defaultMaterial,
    // });
    // this.world!.addContactMaterial(wallMaterial);
    // this.world!.addBody(this.wallBody);

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
    resourceLoader.registerModel('iceCream', '/models/IceCream/ice.glb', {
      onLoad: ({ scene: iceCream }) => {
        console.log(iceCream);
        const scale = 0.005;
        const position = new THREE.Vector3(2, 0, 2);

        iceCream.position.set(position.x, position.y, position.z);
        const body = this.cannon.wrap([iceCream], scale, 0, position);
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
              // console.log(child);
              targetObjects.push(child);
            }
          });
          // targetObjects[0].material.color = new THREE.Color('#ff0000');
          this.cannon.wrap(targetObjects, scale, 0);
          room.scale.set(scale, scale, scale);
          this.scene?.add(room);
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

    animateCharacter(this.character, this.characterBody, this.keysPressed);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    const delta = this.clock.getDelta();
    if (animation.mixer) animation.mixer.update(delta);

    this.cannon.world.step(1 / 60, delta, 3);

    // 키맵 테스트
    // if (this.keysPressed.size > 0) console.log(this.keysPressed.entries());

    // 충돌 감지
    // this.world!.contacts.forEach((contact) => {
    //   if (contact.bi === this.foxBody || contact.bj === this.foxBody) {
    //     console.log('Collision detected');

    //     console.log('hi');
    //     this.foxBody.velocity.set(0, 0, 0);
    //     this.foxBody.angularVelocity.set(0, 0, 0);
    //   }
    // });

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
