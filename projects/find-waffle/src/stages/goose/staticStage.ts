import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/Addons.js';

import ComputerFrameStage from '../computer-frame';
import { GOOSE_IFRAME_ANGLE, GOOSE_QUIZ_ANGLE } from './constant';
import { GooseCamera } from './object/basic/camera';
import { GooseLight } from './object/basic/light';
import { Goose } from './object/goose/Goose';
import { GooseCircularAnimator } from './object/goose/animator';
import { GooseFolderIcon } from './object/icon/FolderIcon';
import { GooseGooseIcon } from './object/icon/GooseIcon';
import { GooseIcon } from './object/icon/Icon';
import { GooseMakerIcon } from './object/icon/MakerIcon';
import { MirrorIcon } from './object/icon/MirrorIcon';
import { GooseMixIcon } from './object/icon/MixIcon';
import { GooseQuizWindow } from './object/window/GooseQuizWindow';
import { HTMLWindow } from './object/window/IframeWindow';
import { PasswordQuizWindow } from './object/window/PasswordQuizWindow';
import { GooseVirtualWindow } from './object/window/VirtualWindow';
import {
  CD_KEY,
  CLOUD_KEY,
  FOLDER_KEY,
  GOOSE2_KEY,
  GOOSE_LOVE,
  GooseResourceLoader,
  HILL_KEY,
  WAFFLE_MAKER_KEY,
  WAFFLE_MIX_KEY,
} from './util/loader';
import { GooseRaycaster } from './util/raycaster';

/** Scene에 있어야할 객체들을 추가합니다. */
export class StaticGooseStage extends ComputerFrameStage {
  // overriden
  camera?: GooseCamera = undefined;

  // renderer
  css3DRenderer?: CSS3DRenderer;

  // util
  loader?: GooseResourceLoader;
  raycaster = new GooseRaycaster();

  // objects
  hill?: THREE.Object3D;
  window1?: GooseVirtualWindow;
  window2?: GooseVirtualWindow;
  gooseQuizWindow?: GooseQuizWindow;
  passwordQuizWindow?: PasswordQuizWindow;
  gooseIframeWindow?: HTMLWindow;
  makerIcon?: GooseMakerIcon;
  mixIcon?: GooseMixIcon;
  gooseIcon?: GooseGooseIcon;
  folderIcon?: GooseIcon;
  mirrorIcon?: MirrorIcon;
  gooseList: Goose[] = [];

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
    this.mountExternalObjs = this.mountExternalObjs.bind(this);
  }

  mount() {
    super.mount();
    this.raycaster.mount();

    this.mountStaticObjs();

    // objects using resource (async)
    this.loader = new GooseResourceLoader();
    this.loader.onLoadComplete = this.mountExternalObjs;
    this.loader.loadAll();

    this.resize();
  }

  /** 외부 리소스가 필요 없는 오브젝트를 마운트합니다. */
  mountStaticObjs() {
    // renderer
    this.css3DRenderer = new CSS3DRenderer();
    this.canvasElement?.after(this.css3DRenderer.domElement);

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('rgb(77,116,231)');

    // camera
    this.camera = new GooseCamera();
    this.camera.maxAngle = GOOSE_QUIZ_ANGLE;
    this.camera.mount();
    this.scene.add(this.camera);

    // objects
    const light = new GooseLight();
    this.window1 = new GooseVirtualWindow(0);
    this.window2 = new GooseVirtualWindow(Math.PI);
    this.gooseQuizWindow = new GooseQuizWindow();
    this.passwordQuizWindow = new PasswordQuizWindow();
    this.gooseIframeWindow = new HTMLWindow(
      GOOSE_IFRAME_ANGLE,
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/JA-9AWVi_e4?si=NwGGq-eqlJn05Dbd&amp;start=13" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    );

    this.scene.add(
      light,
      this.window1,
      this.window2,
      this.gooseQuizWindow,
      this.passwordQuizWindow,
      this.gooseIframeWindow,
    );
  }

  /* 외부 리소스가 필요한 오브젝트들을 마운트합니다.  */
  mountExternalObjs() {
    // hill
    this.hill = this.loader?.getModelObject(HILL_KEY)!;

    // cloud
    const cloud = this.loader?.getModelObject(CLOUD_KEY)!;

    // goose
    this.gooseList.push(
      new Goose(
        this.loader!.loadGooseTextures(),
        this.loader!.getTexture(GOOSE_LOVE)!,
        new GooseCircularAnimator(this.hill, 45, THREE.MathUtils.degToRad(-20)),
      ),
      new Goose(
        this.loader!.loadGooseTextures(),
        this.loader!.getTexture(GOOSE_LOVE)!,
        new GooseCircularAnimator(this.hill, 35, THREE.MathUtils.degToRad(-40)),
      ),
    );

    // window1
    this.gooseIcon = new GooseGooseIcon(this.loader?.getTexture(GOOSE2_KEY)!);
    this.mirrorIcon = new MirrorIcon(this.loader?.getTexture(CD_KEY)!);
    this.folderIcon = new GooseFolderIcon(this.loader?.getTexture(FOLDER_KEY)!);
    this.window1?.registerIcon(
      this.mirrorIcon,
      this.gooseIcon,
      this.folderIcon,
    );

    // window2
    this.mixIcon = new GooseMixIcon(
      this.loader?.getModelObject(WAFFLE_MIX_KEY)!,
    );
    this.makerIcon = new GooseMakerIcon(
      this.loader?.getModelObject(WAFFLE_MAKER_KEY)!,
    );
    this.window2?.registerIcon(this.mixIcon, this.makerIcon);

    this.scene?.add(
      this.hill,
      cloud,
      this.mirrorIcon,
      this.gooseIcon,
      this.folderIcon,
      ...this.gooseList,
      this.mixIcon,
      this.makerIcon,
    );

    this.resize();
  }

  unmount() {
    this.camera = undefined;
    this.hill = undefined;
    this.window1 = undefined;
    this.window2 = undefined;
    this.makerIcon = undefined;
    this.mixIcon = undefined;
    this.gooseList.length = 0;
    this.raycaster.unmount();
    this.css3DRenderer?.domElement.remove();
    super.unmount();
  }

  animate(time: DOMHighResTimeStamp) {
    super.animate(time);
    if (!this.camera || !this.scene) return;

    this.css3DRenderer?.render(this.scene, this.camera);
    this.raycaster.animate(this.camera);
    this.gooseList.forEach((goose) => goose.animate(time));
  }

  resize() {
    // CSS 렌더러가 WebGL 렌더러의 크기 결정을 방해하는 문제 임시 수정
    this.css3DRenderer?.setSize(0, 0);
    super.resize();

    const parentElement = this.canvasElement?.parentElement;
    if (!parentElement) return;

    const rect = parentElement.getBoundingClientRect();

    this.css3DRenderer?.setSize(rect.width, rect.height);
    this.raycaster.resize(rect);
    this.window1?.resize(rect);
    this.window2?.resize(rect);
  }
}
