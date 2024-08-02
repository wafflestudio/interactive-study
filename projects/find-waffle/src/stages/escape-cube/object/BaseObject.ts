import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { World } from '../World';

export abstract class BaseObject<T extends THREE.Object3D = THREE.Object3D> {
  constructor(
    public world: World,
    public object: T,
    public body: CANNON.Body,
  ) {
    world.map.add(object);
    world.cannonWorld.addBody(body);
  }

  protected syncToCannon() {
    this.object.position.copy(
      this.world.map.mapObject.worldToLocal(
        new THREE.Vector3(...this.body.position.toArray()),
      ),
    );
  }

  protected syncToThree() {
    this.body.position.set(
      ...this.world.map.mapObject
        .localToWorld(this.object.position.clone())
        .toArray(),
    );
  }

  public dispose() {
    this.object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
  }

  public animate(timeDelta: number) {
    if (this.world.map.isRotating) {
      // sleep 일 때는 물리 세계가 threejs 세계를 모방
      this.syncToThree();
      return;
    } else {
      // sleep 이 아닐 때는 threejs 세계가 물리 세계를 모방
      this.syncToCannon();
    }
  }
}
