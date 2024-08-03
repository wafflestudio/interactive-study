import CannonDebugger from 'cannon-es-debugger';
import { noop } from 'es-toolkit';
import { GUI } from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { World } from './World';

export class StageDebugger {
  static cannonDebugger: ReturnType<typeof CannonDebugger>;
  static gui: GUI;
  static animate: () => void = noop;
  static context: any = {
    cannonDebugger: true,
  };

  static init(world: World, camera: THREE.Camera, canvas: HTMLCanvasElement) {
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
  }
}
