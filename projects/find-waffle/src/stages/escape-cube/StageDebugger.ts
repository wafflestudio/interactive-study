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
    controls.target.set(0, 5, 0);
    controls.update();
    this.cannonDebugger = CannonDebugger(world.scene, world.cannonWorld);
    this.gui = new GUI();

    this.animate = () => {
      if (this.context.cannonDebugger) this.cannonDebugger.update();
    };

    this.gui.add(this.context, 'cannonDebugger').onChange((value: boolean) => {
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
  }
}
