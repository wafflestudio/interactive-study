import * as THREE from 'three';

import { Stage } from '../../core/stage/Stage';
import {
  CAMERA_DRAG_DENOM,
  RESOURCE_KEY_CLOUD,
  RESOURCE_KEY_GOOSE1,
  RESOURCE_KEY_GOOSE2,
  RESOURCE_KEY_GOOSE3,
  RESOURCE_KEY_GOOSE4,
  RESOURCE_KEY_HILL,
  SNAP_DISTANCE,
} from './constant';
import { GooseResourceLoader } from './loader';
import { GooseCamera } from './object/camera';
import { Goose } from './object/goose';
import { GooseHill } from './object/hill';
import { GooseWindowIcon } from './object/icon';
import { GooseWindow } from './object/window';
import { GooseRaycaster } from './raycaster';

export class GooseStage extends Stage {
  #scene = new THREE.Scene();
  #camera = new GooseCamera();
  #raycaster = new GooseRaycaster();
  #loader = new GooseResourceLoader();

  #window1?: GooseWindow;
  #window2?: GooseWindow;
  #gooseList: Goose[] = [];

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
    this.handleHillDrag = this.handleHillDrag.bind(this);
  }

  mount() {
    this.#scene.background = new THREE.Color('#B9EBFF');
    this.#scene.add(this.#camera.object);

    this.#camera.mount();
    this.#raycaster.mount();

    // Object 추가
    this.#addBasicObjects();
    this.#loader.onLoad = this.addExternalObjects.bind(this);
    this.#loader.loadAll();

    // new OrbitControls(this.#camera.object, this.app.querySelector('canvas')!);
  }

  unmount() {
    this.#raycaster.unmount();
  }

  animate(time: DOMHighResTimeStamp) {
    this.renderer.render(this.#scene, this.#camera.object);
    this.#raycaster.setFromCamera(this.#camera.object);
    this.#gooseList.forEach((goose) => goose.animate(time));
  }

  resize() {
    // TODO: 바깥 프레임 사이즈 고려
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.#camera.handleResize();
    this.#window1?.resize();
    this.#window2?.resize();
  }

  /** 외부 리소스가 아닌 오브젝트들을 scene에 추가합니다. */
  #addBasicObjects() {
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    const sunlight = new THREE.DirectionalLight('white', 3);
    sunlight.position.set(-100, 10, 0);
    sunlight.lookAt(0, 0, 0);
    sunlight.castShadow = true;

    this.#window1 = new GooseWindow(0, this.#raycaster);
    this.#window2 = new GooseWindow(Math.PI, this.#raycaster);

    this.#scene.add(
      hemisphereLight,
      sunlight,
      this.#window1.object,
      this.#window2.object,
    );
  }

  addExternalObjects() {
    // hill
    const hillModel = this.#loader.loader.getModel(RESOURCE_KEY_HILL)!;
    const hill = new GooseHill(hillModel, this.#raycaster);
    hill.onMouseMove = this.handleHillDrag;
    hill.onMouseUp = () => {
      if (this.#angleDiff(this.#camera.angle, 0) < SNAP_DISTANCE) {
        this.#camera.angle = 0;
      } else if (this.#angleDiff(this.#camera.angle, Math.PI) < SNAP_DISTANCE) {
        this.#camera.angle = Math.PI;
      }
    };

    // cloud
    const cloudModel = this.#loader.loader.getModel(RESOURCE_KEY_CLOUD)!;
    const cloud = cloudModel.scene.children[0];

    // goose
    const gooseTexture1 = this.#loader.loader.getTexture(RESOURCE_KEY_GOOSE1)!;
    const gooseTexture2 = this.#loader.loader.getTexture(RESOURCE_KEY_GOOSE2)!;
    const gooseTexture3 = this.#loader.loader.getTexture(RESOURCE_KEY_GOOSE3)!;
    const gooseTexture4 = this.#loader.loader.getTexture(RESOURCE_KEY_GOOSE4)!;
    const gooseTextureList = [
      gooseTexture1,
      gooseTexture2,
      gooseTexture3,
      gooseTexture4,
    ];
    this.#gooseList.push(
      new Goose(
        gooseTextureList,
        hill.object,
        45,
        THREE.MathUtils.degToRad(-40),
      ),
    );
    this.#gooseList.push(
      new Goose(
        gooseTextureList,
        hill.object,
        35,
        THREE.MathUtils.degToRad(-60),
      ),
    );

    // icon
    const icon1 = new GooseWindowIcon();
    const icon2 = new GooseWindowIcon();
    this.#window1?.register(icon1, icon2);
    icon1.onMouseDown = () => {
      const goose = new Goose(
        [gooseTexture1, gooseTexture2, gooseTexture3, gooseTexture4],
        hill.object,
        THREE.MathUtils.randInt(35, 45),
        THREE.MathUtils.degToRad(-180),
      );
      this.#scene.add(goose.object);
      this.#gooseList.push(goose);
    };

    this.#scene.add(hill.object, cloud, icon1.object, icon2.object);
    this.#gooseList.forEach((goose) => this.#scene.add(goose.object));

    this.resize();
  }

  handleHillDrag(delta: number) {
    let newValue = this.#camera.angle + -delta / CAMERA_DRAG_DENOM;
    this.#camera.angle = newValue;
  }

  #angleDiff(a: number, b: number) {
    let diff = Math.abs(a - b);
    return Math.PI < diff ? 2 * Math.PI - diff : diff;
  }
}
