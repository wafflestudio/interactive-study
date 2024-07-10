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
        setFoxWalk(fox);
        const keysPressed = {};

        // TODO: Add Keymap
        document.addEventListener('keydown', (event) => {
          keysPressed[event.key] = true;
          updateAnimation(fox, keysPressed);
          console.log(keysPressed);
        });

        document.addEventListener('keyup', (event) => {
          keysPressed[event.key] = false;
          updateAnimation(fox, keysPressed);
          console.log(keysPressed);
        });
        fox.scene.scale.set(0.01, 0.01, 0.01);
        this.scene?.add(fox.scene);
      },
    });
    resourceLoader.registerModel(
      'waffleRoom',
      '/models/WaffleRoom/WaffleRoom.gltf',
      {
        onLoad: ({ scene: room }) => {
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
