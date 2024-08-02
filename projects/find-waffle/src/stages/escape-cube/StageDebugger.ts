import CannonDebugger from 'cannon-es-debugger';
import { chunk, noop } from 'es-toolkit';
import gsap from 'gsap';
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

    world.player.object.geometry.morphAttributes.position = [
      // 바닥 충돌
      new THREE.Float32BufferAttribute(
        chunk(
          Array.from(world.player.object.geometry.attributes.position.array),
          3,
        )
          .map((point) => {
            const [x, y, z] = point;
            return [x, (y + 0.3) * 0.8 - 0.3, z];
          })
          .flat(),
        3,
      ),
      // 천장 충돌
      new THREE.Float32BufferAttribute(
        chunk(
          Array.from(world.player.object.geometry.attributes.position.array),
          3,
        )
          .map((point) => {
            const [x, y, z] = point;
            return [x, (y - 0.3) * 0.8 + 0.3, z];
          })
          .flat(),
        3,
      ),
      // 왼쪽 충돌
      new THREE.Float32BufferAttribute(
        chunk(
          Array.from(world.player.object.geometry.attributes.position.array),
          3,
        )
          .map((point) => {
            const [x, y, z] = point;
            return [(x + 0.3) * 0.8 - 0.3, y, z];
          })
          .flat(),
        3,
      ),
      new THREE.Float32BufferAttribute(
        chunk(
          Array.from(world.player.object.geometry.attributes.position.array),
          3,
        )
          .map((point) => {
            const [x, y, z] = point;
            return [(x - 0.3) * 0.8 + 0.3, y, z];
          })
          .flat(),
        3,
      ),
    ];

    world.player.object.morphTargetInfluences = [0, 0, 0, 0];
    this.context.collideBottomAnimation = () => {
      if (!world.player.object.morphTargetInfluences) return;
      gsap.fromTo(
        world.player.object.morphTargetInfluences,
        { 0: 0 },
        {
          0: 1,
          id: 'collideBottom',
          duration: 0.3,
          repeat: 1,
          yoyo: true,
        },
      );
    };
    this.gui
      .add(this.context, 'collideBottomAnimation')
      .name('바닥 충돌 애니메이션');
    this.context.collideTopAnimation = () => {
      if (!world.player.object.morphTargetInfluences) return;
      gsap.fromTo(
        world.player.object.morphTargetInfluences,
        { 1: 0 },
        {
          1: 1,
          duration: 0.3,
          repeat: 1,
          yoyo: true,
        },
      );
    };
    this.gui
      .add(this.context, 'collideTopAnimation')
      .name('천장 충돌 애니메이션');
    this.context.collideLeftAnimation = () => {
      if (!world.player.object.morphTargetInfluences) return;
      gsap.fromTo(
        world.player.object.morphTargetInfluences,
        { 2: 0 },
        {
          2: 1,
          duration: 0.3,
          repeat: 1,
          yoyo: true,
        },
      );
    };
    this.gui
      .add(this.context, 'collideLeftAnimation')
      .name('왼쪽 충돌 애니메이션');
    this.context.collideRightAnimation = () => {
      if (!world.player.object.morphTargetInfluences) return;
      gsap.fromTo(
        world.player.object.morphTargetInfluences,
        { 3: 0 },
        {
          3: 1,
          duration: 0.3,
          repeat: 1,
          yoyo: true,
        },
      );
    };
    this.gui
      .add(this.context, 'collideRightAnimation')
      .name('오른쪽 충돌 애니메이션');

    this.gui
      .add(
        {
          extraTime: () => {
            world.timer?.addTime(10);
            world.timer?.start();
            world.resume();
          },
        },
        'extraTime',
      )
      .name('10초 추가');

    this.gui
      .add({ fluidization: false }, 'fluidization')
      .name('유체화')
      .onChange((isFluid: boolean) => {
        if (isFluid) {
          world.player.body.shapes[0].collisionFilterGroup = 0;
          world.player.object.material.transparent = true;
          world.player.object.material.opacity = 0.5;
          world.player.object.material.alphaTest = 0.5;
        } else {
          world.player.body.shapes[0].collisionFilterGroup = 1;
          world.player.object.material.transparent = false;
          world.player.object.material.opacity = 1;
          world.player.object.material.alphaTest = 0;
        }
      });
  }
}
