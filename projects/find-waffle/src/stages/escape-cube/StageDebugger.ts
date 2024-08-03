import CannonDebugger from 'cannon-es-debugger';
import { noop } from 'es-toolkit';
import { GUI } from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { WaffleWorld } from './World';

export class StageDebugger {
  static cannonDebugger: ReturnType<typeof CannonDebugger>;
  static gui: GUI;
  static animate: () => void = noop;
  static context: any = {
    cannonDebugger: true,
  };

  static init(world: WaffleWorld, camera: THREE.Camera, canvas: HTMLCanvasElement) {
    const controls = new OrbitControls(camera, canvas);
    this.cannonDebugger = CannonDebugger(world.scene, world.cannonWorld);
    this.gui = new GUI();

    this.animate = () => {
      if (this.context.cannonDebugger) this.cannonDebugger.update();
    };

    this.gui
      .add(this.context, 'cannonDebugger')
      .name('물리 엔진 디버깅')
      .onChange((value: boolean) => {
        world.scene.traverse((object) => {
          if (
            object instanceof THREE.Mesh &&
            object.material instanceof THREE.MeshBasicMaterial &&
            object.material.wireframe
          ) {
            object.visible = value;
          }
        });
      });

    this.context.resetCamera = () => {
      camera.position.set(0, 0, 15);
      controls.target.set(0, 0, 0);
      controls.update();
    };
    this.gui.add(this.context, 'resetCamera').name('카메라 초기화');

    this.gui.add(world, 'restart').name('재시작');

    this.gui
      .add(
        {
          extraTime: () => {
            world.timer?.increase(10);
            world.timer?.start();
            world.resume();
          },
        },
        'extraTime',
      )
      .name('10초 추가');
    this.gui
      .add(
        {
          reduceTime: () => {
            world.timer?.decrease(10);
            world.timer?.start();
            world.resume();
          },
        },
        'reduceTime',
      )
      .name('10초 감소');

    this.gui
      .add({ fluidization: false }, 'fluidization')
      .name('유체화')
      .onChange((isFluid: boolean) => {
        if (isFluid) {
          world.player!.body.shapes[0].collisionFilterGroup = 0;
          world.player!.object.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.material.transparent = true;
              object.material.opacity = 0.5;
              object.material.alphaTest = 0.5;
            }
          });
        } else {
          world.player!.body.shapes[0].collisionFilterGroup = 1;
          world.player!.object.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.material.transparent = false;
              object.material.opacity = 1;
              object.material.alphaTest = 0;
            }
          });
        }
      });
  }
}
