import * as THREE from 'three';

export type SceneTransition = (change: () => void) => {};

export class SceneManager {
  private renderer: THREE.WebGLRenderer;
  roomScene: THREE.Scene = new THREE.Scene();
  roomCamera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
  wardrobeScene: THREE.Scene = new THREE.Scene();
  wardrobeCamera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
  currentScene: THREE.Scene = this.roomScene;
  currentCamera: THREE.PerspectiveCamera = this.roomCamera;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;

    // room
    this.roomScene.add(this.roomCamera);

    // wardrobe
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
