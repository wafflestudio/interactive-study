import gsap from 'gsap';
import * as THREE from 'three';

import { Stage } from '../../core/stage/Stage';
import { StageManager } from '../../core/stage/StageManager';
import { ListenableRaycaster } from '../../libs/raycaster/Raycaster';
import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import CardGameStage from '../card-game';
import { GooseStage } from '../goose/stage';
import { GooseRaycaster } from '../goose/util/raycaster';

const stageManager = StageManager.instance;

const gooseStage = new GooseStage(stageManager.renderer, stageManager.app);
const cardGame = new CardGameStage(stageManager.renderer, stageManager.app);

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

  #raycaster = new ListenableRaycaster(
    this.#camera,
    this.#scene,
    this.renderer,
  );
  #unmountDescription = () => {};

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
  <img src="find_waffle.svg" style="transition: opacity 0.5s;"/>
  <div style="flex-grow: 1"></div>
  <img src="we_serve.svg" style="transition: opacity 0.5s;"/>
  <div style="height: 12px;"></div>
  <img src="copyright.svg" style="transition: opacity 0.5s;"/>
`;
    this.#app.prepend(this.#container);

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.#scene.add(light);

    this.resize();

    this.#waffleRaycaster.mount();
    this.#addDragListener();

    this.#unmountDescription;
  }

  unmount(): void {
    this.#container?.remove();
    this.#waffleRaycaster.unmount();
    this.#unmountDescription();
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
    const stages: {
      id: StageType;
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    }[] = [
      { id: 'CARD', top: 150, right: 150 },
      { id: 'CUBE', bottom: 150, right: 150 },
      { id: 'GOOSE', bottom: 150, left: 150 },
      { id: 'ROOM', top: 150, left: 150 },
    ];
    const jams: {
      mesh: THREE.Mesh;
      material: THREE.MeshBasicMaterial;
      id: StageType;
    }[] = [];

    stagePosition.forEach((position, index) => {
      const material = baseMaterial.clone();
      const jam = new THREE.Mesh(geometry, material);
      jam.rotateX(-Math.PI / 2);
      jam.position.set(...position);
      jams.push({ mesh: jam, material, id: stages[index].id });
      this.#waffle?.add(jam);
    });

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

    this.#raycaster.registerCallback(
      'click',
      (intersects) => {
        if (intersects.length > 0) {
          const jam = jams.find(
            (jam) => jam.mesh.id === intersects[0].object.id,
          );
          if (jam) {
            gsap.to(this.#camera.position, {
              x: jam.mesh.position.x * 1.1,
              y: 100,
              z: jam.mesh.position.z * 1.1,
              duration: 0.5,
              ease: 'power2.out',
            });
            document.querySelectorAll('img').forEach((img) => {
              img.style.opacity = '0';
            });

            this.#unmountDescription();
            const stageId = jam.id;
            const { top, right, bottom, left } = stages.find(
              (stage) => stage.id === stageId,
            )!;
            this.#unmountDescription = insertDescription(
              jam.id,
              top,
              right,
              bottom,
              left,
            );
          }
        } else {
          gsap.to(this.#camera.position, {
            x: 0,
            y: 200,
            z: 0,
            duration: 0.5,
            ease: 'power2.out',
          });
          document.querySelectorAll('img').forEach((img) => {
            img.style.opacity = '1';
          });

          this.#unmountDescription();
        }
      },
      jams.map((jam) => jam.mesh),
    );
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

type StageType = 'GOOSE' | 'CARD' | 'CUBE' | 'ROOM';

const stageInfo: {
  [type in StageType]: {
    title: string;
    hardness: string;
    description: string;
    toStage: () => void;
  };
} = {
  CARD: {
    title: '/Card_Flavor.svg',
    hardness: '/Easy.svg',
    description:
      '카드 게임 속에서 와플을 찾아보세요. 와플을 찾기 위해서는 게임을 진행해야하지만 이 게임은 일반적인 솔리테어 규칙과는 다르게 작동한답니다!',
    toStage: () => {
      StageManager.instance.toStage(cardGame);
    },
  },
  CUBE: {
    title: '/Grid_Flavor.svg',
    hardness: '/Easy.svg',
    description: '',
    toStage: () => {},
  },
  GOOSE: {
    title: '/Goose_Flavor.svg',
    hardness: '/Normal.svg',
    description: '거위가 돌아다니는 컴퓨터를 둘러보며 와플을 찾아보세요.',
    toStage: () => {
      StageManager.instance.toStage(gooseStage);
    },
  },
  ROOM: {
    title: '/Icecream.svg',
    hardness: '/Hard.svg',
    description: '귀염뽀짝한 방에 숨겨진 와플들을 찾아보세요!',
    toStage: () => {},
  },
};

let insertDescription = (
  type: StageType,
  top?: number,
  right?: number,
  bottom?: number,
  left?: number,
) => {
  const container = document.createElement('div');
  const topStyle = top ? `top: ${top}px;` : '';
  const rightStyle = right ? `right: ${right}px;` : '';
  const bottomStyle = bottom ? `bottom: ${bottom}px;` : '';
  const leftStyle = left ? `left: ${left}px;` : '';
  container.style.cssText = `position: fixed; ${topStyle} ${rightStyle} ${bottomStyle} ${leftStyle}`;

  const { title, hardness, description, toStage } = stageInfo[type];

  container.innerHTML = `
<div>
  <img src="${title}" style="display: block; margin-top: 8px;"/>
  <img src="${hardness}" style="display: block; margin-top: 16px;"/>
  <p style="margin-top: 8px; color: #E00000">${description}</p>
  <button style="border: none; background: transparent;">
    <img src="/order.svg" style="margin-left: auto; cursor: pointer;"/>
  </button>
</div>
`;

  const button = container.querySelector('button')!;
  button.addEventListener('click', toStage);

  document.body.append(container);

  return () => container.remove();
};
