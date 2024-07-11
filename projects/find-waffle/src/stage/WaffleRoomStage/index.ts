import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { Stage } from '../../core/stage/Stage';
import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import { animation, setFoxWalk, updateAnimation } from './temp/walk';

export default class WaffleRoomStage extends Stage {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  onKeyDown?: (e: KeyboardEvent) => void;
  light?: THREE.DirectionalLight;
  controls?: OrbitControls;
  clock?: THREE.Clock;
  world?: CANNON.World;
  cannonDebugger?: { update: () => void };
  foxBody?: CANNON.Body;
  wallBody?: CANNON.Body;

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
  }

  public mount() {
    // init scene
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

    // cannon setting
    this.world = new CANNON.World();
    // this.world.gravity.set(0, -9.82, 0);
    const wallmaterial = new CANNON.Material();
    this.wallBody = new CANNON.Body({
      mass: 100,
      position: new CANNON.Vec3(1.2, 1.6, -1.2),
      shape: new CANNON.Box(new CANNON.Vec3(2.5, 2.3, 0.2)),
    });
    this.world!.addBody(this.wallBody);

    // add objects
    this.scene.add(sunLight);
    this.scene.add(this.camera);

    // add controls & animation
    this.controls = new OrbitControls(
      this.camera,
      this.app.querySelector('canvas') as HTMLCanvasElement,
    );
    this.clock = new THREE.Clock();

    // load resources
    const resourceLoader = new ResourceLoader();
    resourceLoader.registerModel('foxModel', '/models/Fox/glTF/Fox.gltf', {
      onLoad: (fox) => {
        fox.scene.traverse((child) => {
          console.log(child);
        });
        setFoxWalk(fox);
        const keysPressed = {};
        fox.scene.position.set(2, 0, 2);

        // connect fox model to cannon-es
        const foxShape = new CANNON.Box(new CANNON.Vec3(0.3, 0.3, 0.5));
        this.foxBody = new CANNON.Body({
          mass: 1,
          position: new CANNON.Vec3(
            fox.scene.position.x,
            fox.scene.position.y + 0.3,
            fox.scene.position.z,
          ),
          shape: foxShape,
        });
        this.world!.addBody(this.foxBody);

        // TODO: Add Keymap
        document.addEventListener('keydown', (event) => {
          keysPressed[event.key] = true;
          updateAnimation(fox, keysPressed, this.foxBody);
        });

        document.addEventListener('keyup', (event) => {
          keysPressed[event.key] = false;
          updateAnimation(fox, keysPressed, this.foxBody);
        });
        fox.scene.scale.set(0.01, 0.01, 0.01);
        this.scene?.add(fox.scene);

        // initialize cannon-es debugger
        this.cannonDebugger = CannonDebugger(this.scene, this.world);
      },
    });
    resourceLoader.registerModel(
      'waffleRoom',
      '/models/WaffleRoom/WaffleRoom.gltf',
      {
        onLoad: ({ scene: room }) => {
          // room.traverse((child) => {
          //   console.log(child);
          // });
          room.scale.set(4, 4, 4);
          this.scene?.add(room);
        },
      },
    );
    resourceLoader.loadAll();
  }

  public animate(): void {
    if (!this.scene || !this.camera || !this.controls || !this.clock) return;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    const delta = this.clock.getDelta();
    if (animation.mixer) animation.mixer.update(delta);

    this.world!.step(1 / 60, delta, 3);

    // 충돌 감지
    this.world!.contacts.forEach((contact) => {
      if (contact.bi === this.foxBody || contact.bj === this.foxBody) {
        console.log('Collision detected');
        // TODO: 충돌 시 이동 제한 로직 추가
      }
    });

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
