import { gsap } from 'gsap';
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { StageManager } from '../../core/stage/StageManager';
import { ListenableRaycaster } from '../../libs/raycaster/Raycaster';
import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import ComputerFrameStage from '../computer-frame';
import { transform } from './constants';

const resources = {
  background: '/card-game/models/findwaffle_background.glb',
  cardplace: '/card-game/models/findwaffle_cardplace.glb',
  cardstack: '/card-game/models/findwaffle_cardstack.glb',
  clubKing: '/card-game/models/findwaffle_club_king.glb',
  clubQueen: '/card-game/models/findwaffle_club_queen.glb',
  diaJack: '/card-game/models/findwaffle_dia_jack.glb',
  diaQueen: '/card-game/models/findwaffle_dia_queen.glb',
  diaKing: '/card-game/models/findwaffle_dia_king.glb',
  heartKing: '/card-game/models/findwaffle_heart_king.glb',
  heartQueen: '/card-game/models/findwaffle_heart_queen.glb',
  spadeKing: '/card-game/models/findwaffle_spade_king.glb',
  spadeQueen: '/card-game/models/findwaffle_spade_queen.glb',
  swordBig: '/card-game/models/findwaffle_sword_big.glb',
  swordSmall: '/card-game/models/findwaffle_sword_small.glb',
  table: '/card-game/models/findwaffle_table.glb',
  tableclothOriginal: '/card-game/models/findwaffle_tablecloth_original.glb',
  tableclothTorn: '/card-game/models/findwaffle_tablecloth_torn.glb',
};

export default class CardGameStage extends ComputerFrameStage {
  resourceLoader: ResourceLoader = new ResourceLoader();
  raycaster: ListenableRaycaster | undefined;
  dragControls: DragControls | undefined;

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
  }

  private init() {
    this.scene = new THREE.Scene();

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
    this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.01, 100);
    this.camera.position.set(0, 0, 5.5);
    this.scene.add(this.camera);

    this.raycaster = new ListenableRaycaster(
      this.camera,
      this.scene,
      this.renderer,
    );

    /**
     * Models
     */
    const table = this.resourceLoader.getModel('table')!;
    const tableclothOriginal =
      this.resourceLoader.getModel('tableclothOriginal')!;
    const tableclothTorn = this.resourceLoader.getModel('tableclothTorn')!;

    const heartQueen = this.resourceLoader.getModel('heartQueen')!;
    const spadeKing = this.resourceLoader.getModel('spadeKing')!;
    const diaJack = this.resourceLoader.getModel('diaJack')!;
    const clubQueen = this.resourceLoader.getModel('clubQueen')!;

    const diaKing = this.resourceLoader.getModel('diaKing')!;
    const heartKing = this.resourceLoader.getModel('heartKing')!;
    const clubKing = this.resourceLoader.getModel('clubKing')!;

    const diaQueen = this.resourceLoader.getModel('diaQueen')!;

    const sword = this.resourceLoader.getModel('swordSmall')!;

    const cardStack = this.resourceLoader.getModel('cardstack')!;

    const planeGeometry = new THREE.PlaneGeometry(0.3, 0.3);
    const planeMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    table.scene.rotateY(transform.object.rotateY);
    tableclothOriginal.scene.rotateY(transform.object.rotateY);
    tableclothOriginal.scene.position.z = transform.tablecloth.position.z;
    tableclothTorn.scene.rotateY(transform.object.rotateY);
    tableclothTorn.scene.position.z = transform.tablecloth.position.z;

    /**
     * 위 쪽 카드들
     */
    heartQueen.scene.rotateY(transform.object.rotateY);
    heartQueen.scene.position.x = transform.heartQueen.position.x;
    heartQueen.scene.position.y = transform.heartQueen.position.y;
    heartQueen.scene.position.z = transform.z1.position.z;
    heartQueen.scene.scale.set(
      transform.card.scale.x,
      transform.card.scale.y,
      transform.card.scale.z,
    );

    spadeKing.scene.rotateY(transform.object.rotateY);
    spadeKing.scene.position.x = transform.spadeKing.position.x;
    spadeKing.scene.position.y = transform.spadeKing.position.y;
    spadeKing.scene.position.z = transform.z1.position.z;
    spadeKing.scene.scale.set(
      transform.card.scale.x,
      transform.card.scale.y,
      transform.card.scale.z,
    );

    diaJack.scene.rotateY(transform.object.rotateY);
    diaJack.scene.position.x = transform.diaJack.position.x;
    diaJack.scene.position.y = transform.diaJack.position.y;
    diaJack.scene.position.z = transform.z1.position.z;
    diaJack.scene.scale.set(
      transform.card.scale.x,
      transform.card.scale.y,
      transform.card.scale.z,
    );

    clubQueen.scene.rotateY(transform.object.rotateY);
    clubQueen.scene.position.x = transform.clubQueen.position.x;
    clubQueen.scene.position.y = transform.clubQueen.position.y;
    clubQueen.scene.position.z = transform.z1.position.z;
    clubQueen.scene.scale.set(
      transform.card.scale.x,
      transform.card.scale.y,
      transform.card.scale.z,
    );

    /**
     * 아래 쪽 카드들
     */
    diaKing.scene.rotateY(transform.object.rotateY);
    diaKing.scene.position.x = transform.diaKing.position.x;
    diaKing.scene.position.y = transform.diaKing.position.y;
    diaKing.scene.position.z = transform.z2.position.z;
    diaKing.scene.scale.set(
      transform.card.scale.x,
      transform.card.scale.y,
      transform.card.scale.z,
    );

    heartKing.scene.rotateY(transform.object.rotateY);
    heartKing.scene.position.x = transform.heartKing.position.x;
    heartKing.scene.position.y = transform.heartKing.position.y;
    heartKing.scene.position.z = transform.z2.position.z;
    heartKing.scene.scale.set(
      transform.card.scale.x,
      transform.card.scale.y,
      transform.card.scale.z,
    );

    clubKing.scene.rotateY(transform.object.rotateY);
    clubKing.scene.position.x = transform.clubKing.position.x;
    clubKing.scene.position.y = transform.clubKing.position.y;
    clubKing.scene.position.z = transform.z2.position.z;
    clubKing.scene.scale.set(
      transform.card.scale.x,
      transform.card.scale.y,
      transform.card.scale.z,
    );

    /**
     * 숨어있는 카드
     */
    diaQueen.scene.rotateY(transform.diaQueen.rotateY);
    diaQueen.scene.rotateX(transform.diaQueen.rotateX);
    diaQueen.scene.rotateZ(Math.PI / 64);
    diaQueen.scene.rotateY(Math.PI / 64);
    diaQueen.scene.position.x = transform.diaQueen.position.x;
    diaQueen.scene.position.y = transform.diaQueen.position.y;
    diaQueen.scene.position.z = transform.z0.position.z;
    diaQueen.scene.scale.set(
      transform.card.scale.x,
      transform.card.scale.y,
      transform.card.scale.z,
    );

    /**
     * sword
     */
    sword.scene.rotateY(transform.object.rotateY);
    sword.scene.position.z = transform.z0.position.z;
    sword.scene.position.x = transform.sword.position.x;
    sword.scene.position.y = transform.sword.position.y;

    /**
     * card stack
     */
    cardStack.scene.rotateY(transform.object.rotateY);
    cardStack.scene.position.z = 0;
    cardStack.scene.position.x = 0;
    cardStack.scene.position.y = 0;
    cardStack.scene.scale.set(
      transform.card.scale.y,
      transform.card.scale.y,
      transform.card.scale.z,
    );

    plane.rotateY(-Math.PI / 2);
    plane.position.z = 3.85;
    plane.position.x = -0.15;
    this.scene.add(plane);

    this.scene.add(table.scene);
    this.scene.add(tableclothOriginal.scene);

    this.scene.add(heartQueen.scene);
    this.scene.add(spadeKing.scene);
    this.scene.add(diaJack.scene);
    this.scene.add(clubQueen.scene);

    this.scene.add(diaKing.scene);
    this.scene.add(heartKing.scene);
    this.scene.add(clubKing.scene);

    this.scene.add(sword.scene);
    this.scene.add(cardStack.scene);

    /**
     * Drag Controls
     */
    const draggable: THREE.Object3D[] = [
      diaKing.scene,
      heartKing.scene,
      clubKing.scene,
      sword.scene,
    ];
    const clickable: THREE.Object3D[] = [];

    const addDraggable = (object3D: THREE.Object3D) => {
      draggable.push(object3D);
    };

    const deleteDraggable = (object3D: THREE.Object3D) => {
      draggable.splice(
        draggable.findIndex((d) => d.id === object3D.id),
        1,
      );
    };

    this.dragControls = new DragControls(
      draggable,
      this.camera,
      this.renderer.domElement,
    );
    this.dragControls.transformGroup = true;

    const isNear = (
      a: { x: number; y: number },
      b: { x: number; y: number },
    ) => {
      return Math.abs(a.x - b.x) < 0.2 && Math.abs(a.y - b.y) < 0.2;
    };

    const updatePosition = (
      object3D: THREE.Object3D,
      targetPosition: {
        x: number;
        y: number;
      },
    ) => {
      return new Promise((resolve) => {
        gsap.to(object3D.position, {
          x: targetPosition.x,
          y: targetPosition.y,
          duration: 0.3,
          onUpdate: () => {
            object3D.position.set(
              object3D.position.x,
              object3D.position.y,
              object3D.position.z, // Maintain z position
            );
          },
          onComplete: () => {
            resolve(true);
          },
        });
      });
    };

    let placedKingCount = 1;
    let isDiaQueenPlaced = false;

    const kings = [
      diaKing.scene,
      heartKing.scene,
      clubKing.scene,
      spadeKing.scene,
    ];

    this.dragControls.addEventListener('dragstart', (event) => {
      const eventObjId = event.object.id;

      switch (eventObjId) {
        case sword.scene.id:
          sword.scene.position.z = transform.z4.position.z;
          gsap.to(sword.scene.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 1,
            onUpdate: () => {
              sword.scene.scale.set(
                sword.scene.scale.x,
                sword.scene.scale.y,
                sword.scene.scale.z,
              );
            },
          });
          break;

        case diaQueen.scene.id:
          diaQueen.scene.position.z = transform.z4.position.z;
          gsap.to(diaQueen.scene.rotation, {
            y: transform.object.rotateY,
            x: 0,
            z: 0,
            duration: 0.3,
            onUpdate: () => {
              diaQueen.scene.rotation.set(
                diaQueen.scene.rotation.x,
                diaQueen.scene.rotation.y,
                diaQueen.scene.rotation.z,
              );
            },
          });
      }
    });

    this.dragControls.addEventListener('drag', (event) => {
      const eventObjId = event.object.id;

      switch (eventObjId) {
        case sword.scene.id:
          sword.scene.position.z = transform.z4.position.z;
          break;

        case diaQueen.scene.id:
          diaQueen.scene.position.z = transform.z3.position.z;
          break;
      }
    });

    this.dragControls.addEventListener('dragend', async (event) => {
      const eventObjId = event.object.id;
      const position = event.object.position;

      switch (eventObjId) {
        case heartKing.scene.id:
          if (isNear(position, transform.heartQueen.position)) {
            deleteDraggable(event.object);
            placedKingCount++;

            await updatePosition(event.object, transform.heartQueen.position);
            this.scene?.remove(heartQueen.scene);
            heartKing.scene.position.z = transform.z2.position.z;
          } else {
            updatePosition(event.object, transform.heartKing.position);
          }
          break;

        case clubKing.scene.id:
          if (isNear(position, transform.clubQueen.position)) {
            deleteDraggable(event.object);
            placedKingCount++;

            await updatePosition(event.object, transform.clubQueen.position);
            this.scene?.remove(clubQueen.scene);
            clubKing.scene.position.z = transform.z2.position.z;
          } else {
            updatePosition(event.object, transform.clubKing.position);
          }
          break;

        case diaQueen.scene.id:
          if (isNear(position, transform.diaJack.position)) {
            deleteDraggable(event.object);

            await updatePosition(event.object, transform.diaJack.position);
            this.scene?.remove(diaJack.scene);
            diaQueen.scene.position.z = transform.z2.position.z;

            isDiaQueenPlaced = true;
          } else {
            updatePosition(event.object, transform.diaQueen.position);
          }
          break;

        case diaKing.scene.id:
          if (isDiaQueenPlaced) {
            if (isNear(position, transform.diaJack.position)) {
              deleteDraggable(event.object);
              placedKingCount++;

              await updatePosition(event.object, transform.diaJack.position);
              this.scene?.remove(diaQueen.scene);
              diaKing.scene.position.z = transform.z4.position.z;
            } else {
              updatePosition(event.object, transform.diaKing.position);
            }
          } else {
            updatePosition(event.object, transform.diaKing.position);
          }
          break;

        case sword.scene.id:
          if (isNear(position, { x: 0.7, y: -0.85 })) {
            this.scene?.remove(tableclothOriginal.scene);
            this.scene?.remove(sword.scene);
            this.scene?.add(tableclothTorn.scene);
            this.scene?.add(diaQueen.scene);

            deleteDraggable(sword.scene);
            addDraggable(diaQueen.scene);
          }
          break;
      }

      if (placedKingCount === 4) {
        const rotateAndMove = async (king: THREE.Object3D) => {
          const rotateInPlace = () => {
            return new Promise((resolve) => {
              const tl = gsap.timeline();

              tl.to(king.position, {
                z: 3.9,
                duration: 0.25,
                onUpdate: () => {
                  king.position.set(
                    king.position.x,
                    king.position.y,
                    king.position.z,
                  );
                },
              });
              tl.to(king.position, {
                z: transform.z2.position.z,
                duration: 0.25,
                onUpdate: () => {
                  king.position.set(
                    king.position.x,
                    king.position.y,
                    king.position.z,
                  );
                },
              });

              gsap.to(king.rotation, {
                y: Math.PI / 2,
                duration: 0.5,
                onUpdate: () => {
                  king.rotation.set(
                    king.rotation.x,
                    king.rotation.y,
                    king.rotation.z,
                  );
                },
                onComplete: () => {
                  resolve(true);
                },
              });
            });
          };

          const moveToCenter = () => {
            return new Promise((resolve) => {
              gsap.to(king.position, {
                x: 0,
                y: 0,
                z: 4.02,
                delay: 0.3,
                duration: 0.5,
                ease: 'power2.out',
                onUpdate: () => {
                  king.position.set(
                    king.position.x,
                    king.position.y,
                    king.position.z,
                  );
                },
                onComplete: () => {
                  resolve(true);
                },
              });
            });
          };

          await rotateInPlace();
          await moveToCenter();
        };

        await Promise.all(kings.map(rotateAndMove));

        cardStack.scene.position.z = 3.85;
        kings.forEach((king) => {
          this.scene?.remove(king);
        });

        this.dragControls?.deactivate();

        if (this.camera) {
          gsap.to(this.camera.position, {
            z: 7,
            delay: 0.5,
            duration: 2,
            onUpdate: () => {
              this.camera?.position.set(
                this.camera.position.x,
                this.camera.position.y,
                this.camera.position.z,
              );
            },
            onComplete: () => {
              const controls = new OrbitControls(
                this.camera!,
                this.renderer.domElement,
              );
              controls.target.set(0, 0, 3);
              controls.maxPolarAngle = Math.PI / 2;
              controls.minPolarAngle = Math.PI / 2;
              controls.minAzimuthAngle = -Math.PI / 2;
              controls.maxAzimuthAngle = Math.PI / 2;

              clickable.push(plane);
            },
          });
        }
      }
    });

    const onMouseMove = (intersects: THREE.Intersection[]) => {
      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    };
    const onClick = (intersects: THREE.Intersection[]) => {
      if (intersects.length > 0) {
        const stageManager = StageManager.instance;
        stageManager.toHome();
      }
    };

    this.raycaster.registerCallback('mousemove', onMouseMove, clickable);
    this.raycaster.registerCallback('click', onClick, clickable);
  }

  public mount() {
    super.mount();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    Object.entries(resources).forEach(([key, url]) => {
      this.resourceLoader.registerModel(key, url);
    });

    this.resourceLoader.onLoadComplete = () => {
      this.init();
    };

    this.resourceLoader.loadAll();
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
