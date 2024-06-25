import * as THREE from 'three';

import Stage from '../../util/stage/Stage';
import StageManager from '../../util/stage/StageManager';

export default class TestBlueStage extends Stage {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  onKeyDown?: (e: KeyboardEvent) => void;
  hint?: HTMLElement;

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
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const cube = new THREE.Mesh(geometry, material);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    this.scene.add(light);
    this.scene.add(cube);

    // key mapping
    const stageManager = StageManager.instance;
    this.onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        console.log('Space key pressed in blue');
      }
      if (e.key === 'Backspace') {
        stageManager.toHome();
      }
    };
    window.addEventListener('keydown', this.onKeyDown);

    // animate
    const animate = () => {
      if (!this.scene || !this.camera) return;
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    };
    animate();

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
    console.log('TestBlueStage mounted');
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
    console.log('TestBlueStage unmounted');
  }
}
