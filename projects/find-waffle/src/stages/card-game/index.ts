import * as THREE from 'three';

import ComputerFrameStage from '../computer-frame';

export default class CardGameStage extends ComputerFrameStage {
  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
  }

  public mount() {
    super.mount();
    this.scene = new THREE.Scene();

    /**
     * Objects
     */
    const objects = [];

    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: '#0000ff' });
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = (Math.random() - 0.5) * 10;
      mesh.position.y = (Math.random() - 0.5) * 10;
      mesh.position.z = (Math.random() - 0.5) * 10;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;

      objects.push(mesh);
      this.scene.add(mesh);
    }

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.9);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1);
    directionalLight.position.set(1, 2, 3);
    this.scene.add(directionalLight);

    /**
     * Camera
     */
    this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 1, 100);
    this.camera.position.z = 15;
    this.scene.add(this.camera);
  }

  public animate() {
    super.animate();
  }

  public resize() {
    super.resize();
  }

  public unmount() {
    super.unmount();
  }
}
