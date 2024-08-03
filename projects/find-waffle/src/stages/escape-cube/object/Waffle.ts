import * as CANNON from 'cannon-es';
import gsap from 'gsap';
import * as THREE from 'three';

import { WaffleWorld } from '../World';
import { BaseObject } from './BaseObject';

export class Waffle extends BaseObject<THREE.Group> {
  timeline = gsap.timeline();

  constructor(world: WaffleWorld) {
    const object = world.loader.getModel('waffle')!.scene;
    object.castShadow = true;
    object.name = 'waffle';
    object.position.set(-5, 6, 3);
    object.rotation.set(0, Math.PI / 2, 0);

    const body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Sphere(0.3),
      linearDamping: 0.95,
      linearFactor: new CANNON.Vec3(1, 1, 0),
      angularFactor: new CANNON.Vec3(0, 0, 0),
    });
    body.position.set(-5, 6, 3);

    const tl = gsap.timeline().to(body.position, {
      y: 6.5,
      duration: 0.3,
      repeat: -1,
      yoyo: true,
    });

    body.addEventListener('collide', (e: any) => {
      const player = world.player;
      if (e.body === player?.body) {
        tl.kill();
        player?.win();
      }
    });
    super(world, object, body);
  }
}
