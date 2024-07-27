import * as THREE from 'three';

export type SceneTransition = (change: () => void) => {};

export class SceneManager {
  private renderer: THREE.WebGLRenderer;
  private app: HTMLElement;
  roomScene: THREE.Scene;
  // roomCamera: THREE.PerspectiveCamera;
  roomCamera: THREE.OrthographicCamera;
  wardrobeScene: THREE.Scene;
  wardrobeCamera: THREE.PerspectiveCamera;
  currentScene: THREE.Scene;
  // currentCamera: THREE.PerspectiveCamera;
  currentCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  aspectRatio: number;
  frustumSize: number;

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    this.renderer = renderer;
    this.app = app;
    this.aspectRatio = this.app.clientWidth / this.app.clientHeight;
    this.frustumSize = 8;

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
    this.roomCamera.position.set(5, 6, 5);
    const lookAtPoint = new THREE.Vector3(0, 0, 0);
    this.roomCamera.lookAt(lookAtPoint);

    const sunLight = new THREE.DirectionalLight('#ffffff', 4);
    sunLight.castShadow = true;
    sunLight.shadow.camera.far = 15;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.normalBias = 0.05;
    sunLight.position.set(3, 3, -2.25);
    this.roomScene.add(sunLight);

    const axesHelper = new THREE.AxesHelper(5);
    this.roomScene.add(axesHelper);

    this.roomScene.add(this.roomCamera);

    // wardrobe
    this.wardrobeScene = new THREE.Scene();
    this.wardrobeCamera = new THREE.PerspectiveCamera(
      35,
      this.app.clientWidth / this.app.clientHeight,
      0.1,
      100,
    );
    this.wardrobeScene.add(this.wardrobeCamera);

    // start
    this.currentScene = this.roomScene;
    this.currentCamera = this.roomCamera;
  }

  toRoomScene(transition: SceneTransition) {
    transition(() => {
      this.currentScene = this.roomScene;
      this.currentCamera = this.roomCamera;
    });
  }

  toWardrobeScene(transition: SceneTransition) {
    transition(() => {
      this.currentScene = this.wardrobeScene;
      this.currentCamera = this.wardrobeCamera;
    });
  }

  render() {
    if (!this.currentScene || !this.currentCamera) return;
    this.renderer.render(this.currentScene, this.currentCamera);
  }
}
