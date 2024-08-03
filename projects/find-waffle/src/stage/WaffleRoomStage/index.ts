import CannonDebugger from 'cannon-es-debugger';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import van from 'vanjs-core';

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
import { currentBag } from './ui/Items';

export default class WaffleRoomStage extends Stage {
  scenarioManager: ScenarioManager = new ScenarioManager();
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
  keyMap: KeyMap = new KeyMap();
  dialogue: Dialogue = new Dialogue({ app: this.app });

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
  }

  public mount() {
    /*
     * 1. init scene
     */
    this.renderer.setSize(this.app.clientWidth, this.app.clientHeight);

    // implement managers
    this.sceneManager = new SceneManager(
      this.renderer,
      this.app,
      this.scenarioManager,
    );
    const resourceLoader = new ResourceLoader();
    // this.keyMap = new KeyMap();
    this.cannonManager = new CannonManager();
    // const dialogue = new Dialogue({ app: this.app });

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
      this.keyMap,
      this.sceneManager,
      this.scenarioManager,
      this.cannonManager,
    );
    this.onAnimateCallbacks.push({ cb: player.onAnimate, bindTarget: player });
    this.onUnmountCallbacks.push(player.onUnmount);

    // Props
    resourceLoader.registerModel(
      'waffleRoom',
      '/models/WaffleRoom/models/WaffleRoomFinal2.glb',
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
                '#B2EBF4',
                '#FFB2D9',
                '#FAED7D',
                '#B2CCFF',
                '#B7F0B1',
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

            child.type === 'Mesh' && targetObjects.push(child);
          });

          this.cannonManager?.wrap(targetObjects, scale, 0);

          // filter collision
          const filteredMap = new Map(
            [...this.cannonManager?.totalObjectMap!].filter(
              ([key]) => key != 'Scene',
            ),
          );
          filteredMap.forEach(({ body }) => {
            this.cannonManager?.filterCollision(body, 4, 8);
          });

          // sofa collision
          const sofaInfo1 = this.cannonManager?.totalObjectMap.get('Box17951');
          const sofaInfo2 = this.cannonManager?.totalObjectMap.get('Box17952');
          const sofaInfo3 = this.cannonManager?.totalObjectMap.get('Box17955');
          const sofaInfo4 = this.cannonManager?.totalObjectMap.get('Box17956');
          this.cannonManager?.filterCollision(sofaInfo1!.body, 2, 1);
          this.cannonManager?.filterCollision(sofaInfo2!.body, 2, 1);
          this.cannonManager?.filterCollision(sofaInfo3!.body, 2, 1);
          this.cannonManager?.filterCollision(sofaInfo4!.body, 2, 1);

          // mirror collision
          const mirrorInfo = this.cannonManager?.totalObjectMap.get('Box25995');
          this.cannonManager?.filterCollision(mirrorInfo!.body, 2, 1);

          // wall collision
          const wallInfo1 =
            this.cannonManager?.totalObjectMap.get('wall_right');
          const wallInfo2 = this.cannonManager?.totalObjectMap.get('wall_left');
          const wallInfo3 =
            this.cannonManager?.totalObjectMap.get('wall_right001');
          const wallInfo4 =
            this.cannonManager?.totalObjectMap.get('wall_left001');
          this.cannonManager?.filterCollision(wallInfo1!.body, 2, 1);
          this.cannonManager?.filterCollision(wallInfo2!.body, 2, 1);
          this.cannonManager?.filterCollision(wallInfo3!.body, 2, 1);
          this.cannonManager?.filterCollision(wallInfo4!.body, 2, 1);

          // specify interactive objects (temp: only wardrobe for now)
          const wardrobeInfo = this.cannonManager?.totalObjectMap.get(
            'Armadio_due__ante_Cube',
          );
          console.log(wardrobeInfo);
          this.cannonManager?.filterCollision(wardrobeInfo!.body, 2, 1);
          const wardrobe = new Wardrobe(
            wardrobeInfo!.mesh,
            wardrobeInfo!.body,
            resourceLoader,
            this.keyMap,
            this.sceneManager!,
            this.scenarioManager,
            this.cannonManager!,
          );
          this.onAnimateCallbacks.push({
            cb: wardrobe.onAnimate,
            bindTarget: wardrobe,
          });
          this.onUnmountCallbacks.push(wardrobe.onUnmount);
          this.cannonManager?.filterCollision(wardrobeInfo!.body, 2, 1);

          // Set Packages to interactive objects
          const packagesInfo =
            this.cannonManager?.totalObjectMap.get('box_sample_top');

          const packageMesh = packagesInfo!.mesh;
          (packageMesh as THREE.Mesh).material.color = new THREE.Color(
            '#dbb790',
          );
          const packageLeft = packageMesh.children[0] as THREE.Mesh;
          const packageRight = packageMesh.children[1] as THREE.Mesh;
          packageLeft.material.color = new THREE.Color('#b9967a');
          packageRight.material.color = new THREE.Color('#a47f61');

          console.log(packageMesh);

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
            // clonedPackage.traverse((child) => {
            //   if (child instanceof THREE.Mesh) {
            //     child.material.depthTest = false;
            //     child.renderOrder = 2;
            //   }
            // });
            this.sceneManager?.roomScene.add(clonedPackage);
          });

          packageMesh.position.set(-100, -100, -100);

          this.cannonManager?.wrap(clonedPackages, 1, 0);

          const packages = new Packages(
            packagesInfo!.mesh,
            packagesInfo!.body,
            resourceLoader,
            this.keyMap,
            this.sceneManager!,
            this.scenarioManager,
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
      `backpack_blue`,
      '/models/WaffleRoom/models/backpack_blue.glb',
      {
        onLoad: ({ scene: bag }) => {
          const scale = 16;
          const position = new THREE.Vector3(0, -16, 0);
          bag.scale.set(scale, scale, scale);
          bag.position.set(position.x, position.y, position.z);
          bag.rotation.set(0, Math.PI * 0.15, 0);
          van.derive(() => {
            if (currentBag.val?.id === 0) {
              bag.visible = true;
            } else {
              bag.visible = false;
            }
          });
          this.sceneManager?.wardrobeScene.add(bag);
        },
      },
    );

    resourceLoader.registerModel(
      `backpack_pink`,
      '/models/WaffleRoom/models/backpack_pink.glb',
      {
        onLoad: ({ scene: bag }) => {
          const scale = 16;
          const position = new THREE.Vector3(0, -16, 0);
          bag.scale.set(scale, scale, scale);
          bag.position.set(position.x, position.y, position.z);
          bag.rotation.set(0, Math.PI * 0.15, 0);
          van.derive(() => {
            if (currentBag.val?.id === 1) {
              bag.visible = true;
            } else {
              bag.visible = false;
            }
          });
          this.sceneManager?.wardrobeScene.add(bag);
        },
      },
    );

    resourceLoader.registerModel(
      `backpack_green`,
      '/models/WaffleRoom/models/backpack_green.glb',
      {
        onLoad: ({ scene: bag }) => {
          const scale = 16;
          const position = new THREE.Vector3(0, -16, 0);
          bag.scale.set(scale, scale, scale);
          bag.position.set(position.x, position.y, position.z);
          bag.rotation.set(0, Math.PI * 0.15, 0);
          van.derive(() => {
            if (currentBag.val?.id === 2) {
              bag.visible = true;
            } else {
              bag.visible = false;
            }
          });
          this.sceneManager?.wardrobeScene.add(bag);
        },
      },
    );

    resourceLoader.registerModel(
      `realbag_blue`,
      '/models/WaffleRoom/models/realbag_blue.glb',
      {
        onLoad: ({ scene: bag }) => {
          const scale = 0.27;
          const position = new THREE.Vector3(0, -16, 0);
          bag.scale.set(scale, scale, scale);
          bag.position.set(position.x, position.y, position.z);
          bag.rotation.set(0, Math.PI * 1.1, 0);
          van.derive(() => {
            if (currentBag.val?.id === 3) {
              bag.visible = true;
            } else {
              bag.visible = false;
            }
          });
          this.sceneManager?.wardrobeScene.add(bag);
        },
      },
    );

    resourceLoader.registerModel(
      `realbag_pink`,
      '/models/WaffleRoom/models/realbag_pink.glb',
      {
        onLoad: ({ scene: bag }) => {
          const scale = 1.45;
          const position = new THREE.Vector3(0, -16, 0);
          bag.scale.set(scale, scale, scale);
          bag.position.set(position.x, position.y, position.z);
          bag.rotation.set(0, Math.PI * 1.1, 0);
          van.derive(() => {
            if (currentBag.val?.id === 4) {
              bag.visible = true;
            } else {
              bag.visible = false;
            }
          });
          this.sceneManager?.wardrobeScene.add(bag);
        },
      },
    );

    resourceLoader.registerModel(
      `wafflebag`,
      '/models/WaffleRoom/models/wafflebag_2.glb',
      {
        onLoad: ({ scene: bag }) => {
          const scale = 2.5;
          const position = new THREE.Vector3(0, -16, 0);
          bag.scale.set(scale, scale, scale);
          bag.position.set(position.x, position.y, position.z);
          bag.rotation.set(0, Math.PI * 1.1, 0);
          van.derive(() => {
            if (currentBag.val?.id === 5) {
              bag.visible = true;
            } else {
              bag.visible = false;
            }
          });
          this.sceneManager?.wardrobeScene.add(bag);
        },
      },
    );

    resourceLoader.registerModel(
      `fakeblue`,
      '/models/WaffleRoom/models/fake_blue.glb',
      {
        onLoad: ({ scene: bag }) => {
          const scale = 7;
          const position = new THREE.Vector3(0, -16, 0);
          bag.scale.set(scale, scale, scale);
          bag.position.set(position.x, position.y, position.z);
          bag.rotation.set(0, Math.PI * 0, 0);
          van.derive(() => {
            if (currentBag.val?.id === 6) {
              bag.visible = true;
            } else {
              bag.visible = false;
            }
          });
          this.sceneManager?.wardrobeScene.add(bag);
        },
      },
    );

    resourceLoader.registerModel(
      `fakewhite`,
      '/models/WaffleRoom/models/fake_white.glb',
      {
        onLoad: ({ scene: bag }) => {
          const scale = 7;
          const position = new THREE.Vector3(0, -16, 0);
          bag.scale.set(scale, scale, scale);
          bag.position.set(position.x, position.y, position.z);
          bag.rotation.set(0, Math.PI * 0, 0);
          van.derive(() => {
            if (currentBag.val?.id === 7) {
              bag.visible = true;
            } else {
              bag.visible = false;
            }
          });
          this.sceneManager?.wardrobeScene.add(bag);
        },
      },
    );

    // temp
    this.keyMap.bind('Space', () => {
      this.dialogue.next();
    });
    console.log();

    /*
     * 3. activate
     */
    resourceLoader.loadAll();
    resourceLoader.onLoadComplete = () => {
      // add scenario
      this.scenarioManager.addScenario(
        openingScenario(this.sceneManager!, this.dialogue),
      );
      this.scenarioManager.addScenario(
        wardrobeScenario(this.sceneManager!, this.dialogue),
      );
      this.scenarioManager.addScenario(
        spinboxScenario(
          this.scenarioManager,
          this.sceneManager!,
          this.cannonManager!,
          this.keyMap,
          this.dialogue,
          this.renderer,
        ),
      );
      this.scenarioManager.addScenario(
        spinTileScenario(
          this.scenarioManager,
          this.sceneManager!,
          this.cannonManager!,
          this.keyMap,
          this.dialogue,
          this.renderer,
          player,
        ),
      );

      this.scenarioManager.set('opening_01');
      this.keyMap.activate();
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

    this.onUnmountCallbacks.forEach((callback) => callback.bind(this));

    // done!
    console.log('TestBlueStage unmounted');
  }
}
