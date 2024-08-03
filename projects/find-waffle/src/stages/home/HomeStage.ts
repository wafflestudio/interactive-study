import gsap from 'gsap';
import * as THREE from 'three';

import { Stage } from '../../core/stage/Stage';
import { ListenableRaycaster } from '../../libs/raycaster/Raycaster';
import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';

const WAFFLE_MODEL_KEY = 'waffle';

export class HomeStage extends Stage {
  #app: HTMLElement;
  #container?: HTMLElement;
  #loader = new ResourceLoader();
  #scene = new THREE.Scene();
  // TODO: parameter
  #camera = new THREE.PerspectiveCamera(70, 1);
  #waffle?: THREE.Object3D;

  #raycaster = new ListenableRaycaster(
    this.#camera,
    this.#scene,
    this.renderer,
  );

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
  <h1 style="font-size: 9.375rem; color: #E00000; font-weight: 400; line-height: 1; margin: 0; padding: 0;">find</h1>
  <h1 style="font-size: 9.375rem; color: #E00000; font-weight: 400; line-height: 1; margin: 0; padding: 0;">WAFFLE</h1>
  <div style="flex-grow: 1"></div>
  <h2 style="margin: 0; padding: 0">we serve fresh waffles everyday</h2>
  <p>Copyright 2024. Interactive Study from Waffle Studio all rights reserved.</p>
`;
    this.#app.prepend(this.#container);

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.#scene.add(light);

    this.resize();
  }

  unmount(): void {
    this.#container?.remove();
  }

  resize(): void {
    const { innerHeight: height, innerWidth: width } = window;
    const aspectRatio = width / height;
    this.#camera.aspect = aspectRatio;
    this.#camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate(): void {
    this.renderer.render(this.#scene, this.#camera);
  }

  #onModelLoad() {
    this.#waffle = this.#loader.getModel(WAFFLE_MODEL_KEY)!.scene;
    this.#scene.add(this.#waffle);

    /**
     * Jam
     */
    const geometry = new THREE.PlaneGeometry(20, 20);
    const baseMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd560,
      opacity: 0.8,
      transparent: true,
    });

    const stagePosition: [number, number, number][] = [
      [30, 7, -30],
      [30, 7, 30],
      [-30, 6, 30],
      [-30, 7, -30],
    ];
    const jams: { mesh: THREE.Mesh; material: THREE.MeshBasicMaterial }[] = [];

    for (const position of stagePosition) {
      const material = baseMaterial.clone();
      const jam = new THREE.Mesh(geometry, material);
      jam.rotateX(-Math.PI / 2);
      jam.position.set(...position);
      jams.push({ mesh: jam, material });
      this.#waffle.add(jam);
    }

    this.#raycaster.registerCallback(
      'mousemove',
      (intersects) => {
        if (intersects.length > 0) {
          const jam = jams.find(
            (jam) => jam.mesh.id === intersects[0].object.id,
          );
          if (jam) {
            document.body.style.cursor = 'pointer';
            gsap.to(jam.material, { opacity: 0.8, duration: 0.2 });
          }
        } else {
          document.body.style.cursor = 'default';
          jams.forEach((jam) => {
            gsap.to(jam.material, { opacity: 0, duration: 0.2 });
          });
        }
      },
      jams.map((jam) => jam.mesh),
    );
  }
}
