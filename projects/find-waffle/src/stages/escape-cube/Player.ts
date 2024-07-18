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
    world.map.add(this.object);
  }

  get position() {
    return this.object.position;
  }

  get worldPosition() {
    return this.world.map.localToWorld(this.position.clone());
  }

  set worldPosition(newPosition: THREE.Vector3) {
    this.position.copy(this.world.map.worldToLocal(newPosition));
  }

  private updatePosition(deltaSeconds: number) {
    if (this.world.isRotating) return;
    const movement = this.direction
      .normalize()
      .multiplyScalar(this.speed * deltaSeconds);
    const worldPosition = this.worldPosition;
    worldPosition.add(movement);
    if (worldPosition.x > 5) {
        worldPosition.x = 5;
        this.world.rotate(-90);
    }
    else if (worldPosition.x < -5) {
        worldPosition.x = -5;
        this.world.rotate(90);
    }
    this.worldPosition = worldPosition;
  }

  public update(deltaSeconds: number) {
    this.updatePosition(deltaSeconds);
  }
}
