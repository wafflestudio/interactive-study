import CannonDebugger from 'cannon-es-debugger';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { Stage } from '../../core/stage/Stage';
import { KeyMap } from '../../libs/keyboard/KeyMap';
import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import { CannonManager } from './core/cannon/CannonManager';
import { Dialogue } from './core/dialogue/Dialogue';
import { ScenarioManager } from './core/scenario/ScenarioManager';
import { SceneManager } from './core/scene/SceneManager';
import { Packages } from './object/Packages';
import { Player } from './object/Player';
import { Wardrobe } from './object/Wardrobe';
import { openingScenario } from './scenario/opening';
import { spinboxScenario } from './scenario/spinBox';
import { spinTileScenario } from './scenario/spinTile';
import { wardrobeScenario } from './scenario/wardrobe';

export default class WaffleRoomStage extends Stage {
  sceneManager?: SceneManager;
  controls?: OrbitControls;
  clock?: THREE.Clock;
  cannonDebugger?: { update: () => void };
  onAnimateCallbacks: {
    cb: (time: DOMHighResTimeStamp) => void;
    bindTarget: any;
  }[] = [];
  onUnmountCallbacks: (() => void)[] = [];
  cannonManager?: CannonManager;

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
  }

  public mount() {
    /*
     * 1. init scene
     */
    this.renderer.setSize(this.app.clientWidth, this.app.clientHeight);

    // implement managers
    this.sceneManager = new SceneManager(this.renderer, this.app);
    const scenarioManager = new ScenarioManager();
    const resourceLoader = new ResourceLoader();
    const keyMap = new KeyMap();
    this.cannonManager = new CannonManager();
    const dialogue = new Dialogue({ app: this.app });

    // debug
    this.cannonDebugger = CannonDebugger(
      this.sceneManager.roomScene,
      this.cannonManager.world,
    );

    /*
     * 2. load resources
     */
    // add controls & animation
    // this.controls = new OrbitControls(
    //   this.sceneManager.currentCamera,
    //   this.app.querySelector('canvas') as HTMLCanvasElement,
    // );
    this.clock = new THREE.Clock();

    // Player
    const player = new Player(
      resourceLoader,
      keyMap,
      this.sceneManager,
      scenarioManager,
      this.cannonManager,
    );
    this.onAnimateCallbacks.push({ cb: player.onAnimate, bindTarget: player });
    this.onUnmountCallbacks.push(player.onUnmount);

    // Props
    resourceLoader.registerModel(
      'waffleRoom',
      '/models/WaffleRoom/models/WaffleRoom_final.glb',
      {
        onLoad: ({ scene: room }) => {
          const scale = 1;
          room.scale.set(scale, scale, scale);
          this.sceneManager?.roomScene.add(room);

          // wrap cannon body for all room objects
          const targetObjects: THREE.Object3D[] = [];
          room.traverse((child) => {
            // sofa texture
            if (child.name.startsWith('Box179')) {
              let loader = new THREE.TextureLoader();
              let texture = loader.load(
                '/models/WaffleRoom/textures/sofa_texture.jpg',
              );
              const material = new THREE.MeshPhysicalMaterial({
                map: texture,
              });
              (child as THREE.Mesh).material = material;
            }

            // letter color
            if (child.name.startsWith('letter')) {
              const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
              });
              (child as THREE.Mesh).material = material;
            }
            // tile texture & color
            if (child.name.startsWith('tile')) {
              let loader = new THREE.TextureLoader();
              let texture = loader.load(
                '/models/WaffleRoom/textures/tile_texture.jpeg',
              );
              const material = new THREE.MeshStandardMaterial({ map: texture });
              const colorList = [
                '#e76fc9',
                '#3693e7',
                '#e7001e',
                '#e79c30',
                '#00d0e7',
              ];
              const randomIndex = Math.floor(Math.random() * colorList.length);

              material.color.set(colorList[randomIndex]);
              (child as THREE.Mesh).material = material;
            }

            // make walls invisible
            if (
              child.name === 'wall_right001' ||
              child.name === 'wall_left001'
            ) {
              child.visible = false;
            }

            // walls & frame depth test
            if (child.name === 'wall_right' || child.name === 'wall_left') {
              (child as THREE.Mesh).material.depthTest = false;
              (child as THREE.Mesh).renderOrder = -2;
            }
            if (child.name === '다운로드_(4)') {
              (child as THREE.Mesh).material.depthTest = false;
              (child as THREE.Mesh).renderOrder = -1;
            }
            if (child.name === '평면') {
              (child as THREE.Mesh).material.depthTest = false;
              (child as THREE.Mesh).renderOrder = 0;
            }

            // if (child.name === 'box_sample_top') {
            //   child.visible = false;
            // }

            child.type === 'Mesh' && targetObjects.push(child);
          });

          this.cannonManager?.wrap(targetObjects, scale, 0);
          this.cannonManager?.totalObjectMap.forEach((obj) => {
            // obj.mesh.material.depthTest = false;
            // obj.mesh.renderOrder = 3;
          });

          // filter collision
          const filteredMap = new Map(
            [...this.cannonManager?.totalObjectMap!].filter(
              ([key]) => key != 'Scene',
            ),
          );
          filteredMap.forEach(({ body }) => {
            this.cannonManager?.filterCollision(body, 4, 8);
          });

          // specify interactive objects (temp: only wardrobe for now)
          const wardrobeInfo =
            this.cannonManager?.totalObjectMap.get('wardrobe_base');
          console.log(wardrobeInfo);
          // const wardrobe = new Wardrobe(
          //   wardrobeInfo!.mesh,
          //   wardrobeInfo!.body,
          //   resourceLoader,
          //   keyMap,
          //   this.sceneManager!,
          //   scenarioManager,
          //   this.cannonManager!,
          // );
          // this.onAnimateCallbacks.push({
          //   cb: wardrobe.onAnimate,
          //   bindTarget: wardrobe,
          // });
          // this.onUnmountCallbacks.push(wardrobe.onUnmount);
          // this.cannonManager?.filterCollision(wardrobeInfo!.body, 2, 1);

          // Set Packages to interactive objects
          const packagesInfo =
            this.cannonManager?.totalObjectMap.get('box_sample_top');

          const packageMesh = packagesInfo!.mesh;

          const clonedMesh = packageMesh.clone();
          clonedMesh.name = 'box2';
          clonedMesh.position.set(1, packageMesh.position.y + 2, 3);

          const clonedMesh2 = packageMesh.clone();
          clonedMesh2.name = 'box3';
          clonedMesh2.position.set(3, packageMesh.position.y + 2, 1);

          const clonedMesh3 = packageMesh.clone();
          clonedMesh3.name = 'box4';
          clonedMesh3.position.set(1, packageMesh.position.y, 5);

          const clonedMesh4 = packageMesh.clone();
          clonedMesh4.name = 'box5';
          clonedMesh4.position.set(3, packageMesh.position.y, 3);

          const clonedMesh5 = packageMesh.clone();
          clonedMesh5.name = 'box6';
          clonedMesh5.position.set(5, packageMesh.position.y, 1);

          const clonedMesh6 = packageMesh.clone();
          clonedMesh6.name = 'box1';
          clonedMesh6.position.set(1, packageMesh.position.y + 4, 1);

          const clonedPackages = [
            clonedMesh,
            clonedMesh2,
            clonedMesh3,
            clonedMesh4,
            clonedMesh5,
            clonedMesh6,
          ];
          clonedPackages.forEach((clonedPackage) => {
            clonedPackage.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material.depthTest = false;
                child.renderOrder = 2;
              }
            });
            this.sceneManager?.roomScene.add(clonedPackage);
          });

          this.cannonManager?.wrap(clonedPackages, 1, 0);

          const packages = new Packages(
            packagesInfo!.mesh,
            packagesInfo!.body,
            resourceLoader,
            keyMap,
            this.sceneManager!,
            scenarioManager,
            this.cannonManager!,
          );

          this.onAnimateCallbacks.push({
            cb: packages.onAnimate,
            bindTarget: packages,
          });
          this.onUnmountCallbacks.push(packages.onUnmount);
          this.cannonManager?.filterCollision(packagesInfo!.body, 2, 1);
        },
      },
    );

    // load bags
    resourceLoader.registerModel(
      `waffleBag`,
      '/models/WaffleRoom/models/wafflebag.glb',
      {
        onLoad: ({ scene: bag }) => {
          const scale = 0.1;
          const position = new THREE.Vector3(0, -14, 0);
          bag.scale.set(scale, scale, scale);
          bag.position.set(position.x, position.y, position.z);
          this.sceneManager?.wardrobeScene.add(bag);
        },
      },
    );

    // temp
    keyMap.bind('Space', () => {
      dialogue.next();
    });

    /*
     * 3. activate
     */
    resourceLoader.loadAll();
    resourceLoader.onLoadComplete = () => {
      // add scenario
      scenarioManager.addScenario(
        openingScenario(this.sceneManager!, dialogue),
      );
      scenarioManager.addScenario(
        wardrobeScenario(this.sceneManager!, dialogue),
      );
      scenarioManager.addScenario(
        spinboxScenario(
          this.sceneManager!,
          this.cannonManager!,
          keyMap,
          dialogue,
          this.renderer,
        ),
      );
      scenarioManager.addScenario(
        spinTileScenario(
          this.sceneManager!,
          this.cannonManager!,
          keyMap,
          dialogue,
          this.renderer,
        ),
      );

      scenarioManager.set('opening_01'); // 본인이 담당하는 플롯의 시작점으로 알아서 바꾸기
      keyMap.activate();
    };
  }

  public resize() {
    // TODO: Update to common util function
    if (!this.sceneManager) return;

    if (this.sceneManager.currentCamera instanceof THREE.OrthographicCamera) {
      this.sceneManager.aspectRatio =
        this.app.clientWidth / this.app.clientHeight;
      this.sceneManager.currentCamera.left =
        (-this.sceneManager.frustumSize * this.sceneManager.aspectRatio) / 2;
      this.sceneManager.currentCamera.right =
        (this.sceneManager.frustumSize * this.sceneManager.aspectRatio) / 2;
      this.sceneManager.currentCamera.top = this.sceneManager.frustumSize / 2;
      this.sceneManager.currentCamera.bottom =
        -this.sceneManager.frustumSize / 2;
    } else {
      this.renderer.setSize(this.app.clientWidth, this.app.clientHeight);
      this.sceneManager.currentCamera.aspect =
        this.app.clientWidth / this.app.clientHeight;
      this.sceneManager.currentCamera.updateProjectionMatrix();
    }
  }

  public animate(t: DOMHighResTimeStamp) {
    if (!this.sceneManager || !this.clock || !this.cannonManager) return;

    this.onAnimateCallbacks.forEach(({ cb, bindTarget }) =>
      cb.bind(bindTarget)(t),
    );

    this.sceneManager.render();
    // this.renderer.render(
    //   this.sceneManager.currentScene,
    //   this.sceneManager.currentCamera,
    // );

    const delta = this.clock.getDelta();

    this.cannonManager.world.step(1 / 60, delta, 3);
    this.cannonManager.renderMovement();
    this.cannonManager.stopIfCollided();
    // this.cannonDebugger?.update();
  }

  public unmount() {
    if (!this.sceneManager) return;
    // dispose objects
    this.sceneManager.roomScene.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
    this.sceneManager.wardrobeScene.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });

    this.onUnmountCallbacks.forEach((callback) => callback());

    // done!
    console.log('TestBlueStage unmounted');
  }
}
