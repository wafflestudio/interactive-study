import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import van from 'vanjs-core';

import { Items } from '../../ui/Items';
import './test.css';

export type SceneTransition = (change: () => void) => void;

export class SceneManager {
  private renderer: THREE.WebGLRenderer;
  private app: HTMLElement;
  roomScene: THREE.Scene;
  // roomCamera: THREE.PerspectiveCamera;
  roomCamera: THREE.OrthographicCamera;
  wardrobeScene: THREE.Scene;
  wardrobeCamera: THREE.OrthographicCamera;
  control?: OrbitControls;

  currentScene: THREE.Scene;
  // currentCamera: THREE.PerspectiveCamera;
  currentCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  aspectRatio: number;
  frustumSize: number;

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    this.renderer = renderer;
    this.app = app;
    this.aspectRatio = this.app.clientWidth / this.app.clientHeight;
    this.frustumSize = 50;

    // room
    this.roomScene = new THREE.Scene();
    this.roomCamera = new THREE.OrthographicCamera(
      (-this.frustumSize * this.aspectRatio) / 2,
      (this.frustumSize * this.aspectRatio) / 2,
      this.frustumSize / 2,
      -this.frustumSize / 2,
      0.1,
      1000,
    );
    // this.roomCamera = new THREE.PerspectiveCamera(
    //   35,
    //   this.app.clientWidth / this.app.clientHeight,
    //   0.1,
    //   10000,
    // );
    this.roomCamera.position.set(100, 80, 100);
    const lookAtPoint = new THREE.Vector3(0, 0, 0);
    this.roomCamera.lookAt(lookAtPoint);

    const sunLight = new THREE.DirectionalLight('#ffffff', 3);
    sunLight.castShadow = false;
    sunLight.shadow.camera.far = 15;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.normalBias = 0.05;
    sunLight.position.set(3, 3, -2.25);
    this.roomScene.add(sunLight);
    const sunLight2 = new THREE.DirectionalLight('#ffffff', 4);
    sunLight2.castShadow = true;
    sunLight2.shadow.camera.far = 15;
    sunLight2.shadow.mapSize.set(1024, 1024);
    sunLight2.shadow.normalBias = 0.05;
    sunLight2.position.set(-3, -3, 2.25);
    this.roomScene.add(sunLight2);

    const axesHelper = new THREE.AxesHelper(5);
    this.roomScene.add(axesHelper);

    this.roomScene.add(this.roomCamera);

    // wardrobe
    this.wardrobeScene = new THREE.Scene();
    this.wardrobeCamera = new THREE.OrthographicCamera(
      (-this.frustumSize * this.aspectRatio) / 2,
      (this.frustumSize * this.aspectRatio) / 2,
      this.frustumSize / 2,
      -this.frustumSize / 2,
      0.1,
      1000,
    );
    this.wardrobeCamera.position.set(100, 80, 100);
    this.wardrobeCamera.lookAt(lookAtPoint);

    const sunLight3 = new THREE.DirectionalLight('#ffffff', 3);
    sunLight3.castShadow = false;
    sunLight3.shadow.camera.far = 15;
    sunLight3.shadow.mapSize.set(1024, 1024);
    sunLight3.shadow.normalBias = 0.05;
    sunLight3.position.set(3, 3, -2.25);

    const sunLight4 = new THREE.DirectionalLight('#ffffff', 4);
    sunLight4.castShadow = true;
    sunLight4.shadow.camera.far = 15;
    sunLight4.shadow.mapSize.set(1024, 1024);
    sunLight4.shadow.normalBias = 0.05;
    sunLight4.position.set(-3, -3, 2.25);

    this.wardrobeScene.add(sunLight3);
    this.wardrobeScene.add(sunLight4);

    // this.wardrobeScene.add(axesHelper);

    this.wardrobeScene.add(this.wardrobeCamera);

    // start
    this.currentScene = this.roomScene;
    this.currentCamera = this.roomCamera;
    // this.currentScene = this.wardrobeScene;
    // this.currentCamera = this.wardrobeCamera;
  }

  toRoomScene(transition: SceneTransition) {
    transition(() => {
      this.currentScene = this.roomScene;
      this.currentCamera = this.roomCamera;
    });
  }

  toWardrobeScene(transition: SceneTransition) {
    transition(() => {
      van.add(this.app, Items);
      this.currentScene = this.wardrobeScene;
      this.currentCamera = this.wardrobeCamera;

      const target = this.app.querySelector('#canvas') as HTMLElement;
      target.classList.add('wardrobeCanvas');

      this.renderer.setSize(
        this.app.clientWidth / 2,
        this.app.clientHeight / 2,
      );
      this.control = new OrbitControls(this.wardrobeCamera, target!);
      this.app.classList.add('noApp');
    });
  }
  unmountWardrobeScene() {}

  render() {
    if (!this.currentScene || !this.currentCamera) return;
    this.renderer.render(this.currentScene, this.currentCamera);
    if (this.control) this.control?.update();
  }
}
