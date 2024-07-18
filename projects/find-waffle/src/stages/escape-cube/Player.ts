import * as THREE from 'three';

import { World } from './World';

export class Player {
  object: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  direction: THREE.Vector3 = new THREE.Vector3();
  speed = 3;

  constructor(public world: World) {
    const geometry = new THREE.SphereGeometry(0.3);
    const material = new THREE.MeshStandardMaterial({ color: 0xadadee });
    this.object = new THREE.Mesh(geometry, material);
    this.object.name = 'player';
    this.object.position.set(-4, 10, 4);
    world.scene.add(this.object);
  }

  get position() {
    return this.object.position;
  }

  private updatePosition(deltaSeconds: number) {
    const movement = this.direction
      .normalize()
      .multiplyScalar(this.speed * deltaSeconds);
    this.position.add(movement);
  }

  public update(deltaSeconds: number) {
    this.updatePosition(deltaSeconds);
  }
}
