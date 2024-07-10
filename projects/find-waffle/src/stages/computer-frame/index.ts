import * as THREE from 'three';

import { Stage } from '../../core/stage/Stage';

const imageSize = {
  width: 1920,
  height: 1080,
};
const screenSize = {
  width: 876,
  height: 778,
};
const screenPosition = {
  top: 78,
  left: 522,
};

const imageAspect = imageSize.width / imageSize.height; // 1920 / 1080
const screenAspect = screenSize.width / screenSize.height; // 700 / 618

const screenRatio = {
  width: screenSize.width / imageSize.width, // 700 / 1920
  height: screenSize.height / imageSize.height, // 618 / 1080
};
const screenPositionRatio = {
  top: screenPosition.top / imageSize.height, // 174 / 1080
  left: screenPosition.left / imageSize.width, // 610 / 1920
};

export default class ComputerFrameStage extends Stage {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;

  screen?: HTMLElement; // computer screen (including taskbar)
  canvas?: HTMLCanvasElement; // only canvas

  aspectRatio?: number; // canvas aspect ratio

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
  }

  public mount() {
    const canvas = this.app.querySelector('#canvas') as HTMLCanvasElement;

    const computer = document.createElement('div');
    computer.className = 'computer';

    const computerScreen = document.createElement('div');
    computerScreen.className = 'computer__screen';

    const computerMain = document.createElement('div');
    computerMain.className = 'computer__main';

    const computerTaskbar = document.createElement('div');
    computerTaskbar.className = 'computer__taskbar';
    computerTaskbar.innerHTML = `
      <button class="computer__start-button computer__button">
        <img class="computer__text" src="/computer-frame/images/start.svg" alt="start" />
      </button>

      <div class="computer__taskbar-divider"></div>
      <div style="flex: 1"></div>
      <div class="computer__taskbar-divider"></div>

      <div class="computer__taskbar-time">
        <img class="computer__text" src="/computer-frame/images/time.svg" alt="PM 12:00" />
      </div>
    `;

    const computerImage = document.createElement('img');
    computerImage.src = '/computer-frame/images/computer.png';
    computerImage.className = 'computer__image';

    computerMain.appendChild(canvas);
    computerScreen.appendChild(computerMain);
    computerScreen.appendChild(computerTaskbar);
    computer.appendChild(computerScreen);
    computer.appendChild(computerImage);
    this.app.appendChild(computer);

    this.screen = computerScreen;
    this.canvas = canvas;
    this.resize();

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
    if (!this.scene || !this.camera) return;
    this.renderer.render(this.scene, this.camera);
  }

  public resize() {
    /**
     * 1. Update screen size and position
     */
    const windowAspect = window.innerWidth / window.innerHeight;
    const screen = this.screen as HTMLElement;

    if (windowAspect < imageAspect) {
      // height is full and width is cropped
      // so, screen size is based on height

      const imageHeight = window.innerHeight;
      const imageWidth = imageHeight * imageAspect;
      // size of the computer image (not cropped)

      const croppedWidth = imageWidth - window.innerWidth;

      const screenHeight = imageHeight * screenRatio.height;
      const screenWidth = screenHeight * screenAspect;

      const screenTop = imageHeight * screenPositionRatio.top; // not cropped
      const screenLeft =
        imageWidth * screenPositionRatio.left - croppedWidth / 2; // cropped

      screen.style.height = `${screenHeight}px`;
      screen.style.width = `${screenWidth}px`;

      screen.style.top = `${screenTop}px`;
      screen.style.left = `${screenLeft}px`;
    } else {
      // width is full and height is cropped
      // so, screen size is based on width

      const imageWidth = window.innerWidth;
      const imageHeight = imageWidth / imageAspect;
      // size of the computer image (not cropped)

      const croppedHeight = imageHeight - window.innerHeight;

      const screenWidth = imageWidth * screenRatio.width;
      const screenHeight = screenWidth / screenAspect;

      const screenLeft = imageWidth * screenPositionRatio.left; // not cropped
      const screenTop =
        imageHeight * screenPositionRatio.top - croppedHeight / 2; // cropped

      screen.style.width = `${screenWidth}px`;
      screen.style.height = `${screenHeight}px`;

      screen.style.top = `${screenTop}px`;
      screen.style.left = `${screenLeft}px`;
    }

    /**
     * 2. Update renderer and camera
     */
    const canvas = this.canvas as HTMLCanvasElement;

    const width = canvas.parentElement?.clientWidth;
    const height = canvas.parentElement?.clientHeight;

    if (!width || !height) return;
    this.aspectRatio = width / height;

    // Update renderer
    this.renderer.setSize(width, height);

    // Update camera
    if (!this.camera) return;
    this.camera.aspect = this.aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  public unmount() {
    if (this.canvas) {
      this.app.appendChild(this.canvas);
    }

    // clear properties
    this.scene = undefined;
    this.camera = undefined;
    this.screen = undefined;
    this.canvas = undefined;
    this.aspectRatio = undefined;
  }
}
