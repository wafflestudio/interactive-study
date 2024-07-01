import * as THREE from 'three';

import { Stage } from '../../util/stage/Stage';
import { StageManager } from '../../util/stage/StageManager';

export default class TestYellowStage extends Stage {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  onKeyDown?: (e: KeyboardEvent) => void;
  hint?: HTMLElement;
  cube?: THREE.Mesh;
  light?: THREE.DirectionalLight;

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
  }

  public mount() {
    // init scene
    this.renderer.setSize(this.app.clientWidth, this.app.clientHeight);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.app.clientWidth / this.app.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 5;

    // add objects
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(1, 1, 1).normalize();
    this.scene.add(this.light);
    this.scene.add(this.cube);

    // key mapping
    const stageManager = StageManager.instance;
    this.onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        console.log('Space key pressed in yellow');
      }
      if (e.key === 'Backspace') {
        stageManager.toHome();
      }
    };
    window.addEventListener('keydown', this.onKeyDown);

    // add div
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = '10px';
    div.style.left = '10px';
    div.style.color = 'white';
    div.style.whiteSpace = 'pre-wrap';
    div.innerText =
      'Press Backspace to return home\nPress Space to console.log';
    this.app.appendChild(div);
    this.hint = div;

    // done!
    console.log('TestYellowStage mounted');
  }

  public animate(): void {
    if (!this.scene || !this.camera || !this.cube) return;
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
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

    // clean DOM
    this.hint?.remove();

    // done!
    console.log('TestYellowStage unmounted');
  }
}
