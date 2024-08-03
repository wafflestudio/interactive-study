import * as THREE from 'three';
import { onumber } from 'zod';

import { Stage } from '../../core/stage/Stage';
import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import { GooseRaycaster } from '../goose/util/raycaster';

const WAFFLE_MODEL_KEY = 'waffle';

export class HomeStage extends Stage {
  #app: HTMLElement;
  #container?: HTMLElement;
  #loader = new ResourceLoader();
  #scene = new THREE.Scene();
  #camera = new THREE.PerspectiveCamera(70, 1);

  // 와플 회전용
  // 급해서 익숙한거 씀
  #waffleRaycaster = new GooseRaycaster();

  #waffle?: THREE.Object3D;

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
    renderer.setClearColor(0, 0);

    this.#app = app;

    this.#camera.position.set(0, 200, 0);
    this.#camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.#loader.registerModel(WAFFLE_MODEL_KEY, '/wafflewithnames.glb');
    this.#loader.onLoadComplete = () => {
      this.#onModelLoad();
    };
    this.#loader.loadAll();
  }

  mount(): void {
    this.#container = document.createElement('div');
    this.#container.style.cssText =
      'display: flex; flex-direction: column; align-items: center; width: 100%; margin: 2.75rem 0;';
    this.#container.innerHTML = `
  <img src="find_waffle.svg"/>
  <div style="flex-grow: 1"></div>
  <img src="we_serve.svg"/>
  <div style="height: 12px;"></div>
  <img src="copyright.svg"/>
`;
    this.#app.prepend(this.#container);

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.#scene.add(light);

    this.resize();

    this.#waffleRaycaster.mount();
    this.#addDragListener();
  }

  unmount(): void {
    this.#container?.remove();
    this.#waffleRaycaster.unmount();
  }

  resize(): void {
    const { innerHeight: height, innerWidth: width } = window;
    const aspectRatio = width / height;
    this.#camera.aspect = aspectRatio;
    this.#camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.#waffleRaycaster.resize(
      new DOMRect(0, 0, window.innerWidth, window.innerHeight),
    );
  }

  animate(): void {
    this.renderer.render(this.#scene, this.#camera);
    this.#waffleRaycaster.animate(this.#camera);
  }

  #onModelLoad() {
    this.#waffle = this.#loader.getModel(WAFFLE_MODEL_KEY)!.scene;
    this.#scene.add(this.#waffle);
  }

  #addDragListener() {
    addEventListener('mousedown', () => {
      if (!this.#waffle) return;

      const onWaffle =
        0 < this.#waffleRaycaster.intersectObject(this.#waffle).length;
      if (!onWaffle) return;

      let prev: { x: number; y: number } | null = null;

      const onMouseMove = ({ clientX: x, clientY: y }: MouseEvent) => {
        const cur = { x, y };
        prev ||= cur;
        const diff = { x: x - prev.x, y: y - prev.y };

        this.#waffle?.rotateOnWorldAxis(
          new THREE.Vector3(0, 0, 1),
          -diff.x / 200,
        );
        this.#waffle?.rotateOnWorldAxis(
          new THREE.Vector3(1, 0, 0),
          diff.y / 200,
        );

        prev = cur;
      };

      const onMouseUp = () => {
        removeEventListener('mousemove', onMouseMove);
        removeEventListener('mouseup', onMouseUp);
      };

      addEventListener('mousemove', onMouseMove);
      addEventListener('mouseup', onMouseUp);
    });
  }
}
