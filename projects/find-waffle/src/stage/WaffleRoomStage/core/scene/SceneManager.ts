import * as THREE from 'three';

export type SceneTransition = (change: () => void) => {};

export class SceneManager {
  private renderer: THREE.WebGLRenderer;
  private app: HTMLElement;
  roomScene: THREE.Scene;
  roomCamera: THREE.PerspectiveCamera;
  wardrobeScene: THREE.Scene;
  wardrobeCamera: THREE.PerspectiveCamera;
  currentScene: THREE.Scene;
  currentCamera: THREE.PerspectiveCamera;

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    this.renderer = renderer;
    this.app = app;

    // room
    this.roomScene = new THREE.Scene();
    this.roomCamera = new THREE.PerspectiveCamera(
      35,
      this.app.clientWidth / this.app.clientHeight,
      0.1,
      100,
    );
    this.roomCamera.position.set(9, 6, 9);
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
