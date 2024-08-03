import * as THREE from 'three';

import { Stage } from '../../core/stage/Stage';
import { url } from '../../utils';

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

  computerElement?: HTMLElement; // computer
  screenElement?: HTMLElement; // computer screen (including taskbar)
  canvasElement?: HTMLCanvasElement; // only canvas
  timeElement?: HTMLTimeElement;

  aspectRatio?: number; // canvas aspect ratio
  intervalId?: number;

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
        <p class="computer__text">Start</p>
      </button>

      <div class="computer__taskbar-divider"></div>
      <div style="flex: 1"></div>
      <div class="computer__taskbar-divider"></div>

      <div class="computer__taskbar-time">
        <time class="computer__text"></time>
      </div>
    `;

    const computerImage = document.createElement('img');
    computerImage.src = url('/computer-frame/images/computer.png');
    computerImage.className = 'computer__image';

    computerMain.appendChild(canvas);
    computerScreen.appendChild(computerMain);
    computerScreen.appendChild(computerTaskbar);
    computer.appendChild(computerScreen);
    computer.appendChild(computerImage);
    this.app.appendChild(computer);

    this.computerElement = computer;
    this.screenElement = computerScreen;
    this.canvasElement = canvas;
    this.timeElement = computerTaskbar.querySelector('time') as HTMLTimeElement;
    this.resize();

    this.updateTime();
    this.intervalId = setInterval(this.updateTime.bind(this), 1000);
  }

  public animate(_time: DOMHighResTimeStamp) {
    if (!this.scene || !this.camera) return;
    this.renderer.render(this.scene, this.camera);
  }

  public resize() {
    /**
     * 1. Update screen size and position
     */
    const windowAspect = window.innerWidth / window.innerHeight;
    const screen = this.screenElement as HTMLElement;

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
    const canvas = this.canvasElement as HTMLCanvasElement;

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
    if (this.computerElement) {
      this.app.removeChild(this.computerElement);
    }
    if (this.canvasElement) {
      this.app.appendChild(this.canvasElement);
    }
    clearInterval(this.intervalId);
    this.intervalId = undefined;

    // clear properties
    this.scene = undefined;
    this.camera = undefined;
    this.screenElement = undefined;
    this.canvasElement = undefined;
    this.aspectRatio = undefined;
  }

  private updateTime() {
    if (this.timeElement) {
      this.timeElement.innerText = new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    }
  }
}
