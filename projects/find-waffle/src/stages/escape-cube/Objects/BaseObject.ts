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
      this.world.map.worldToLocal(
        new THREE.Vector3(...this.body.position.toArray()),
      ),
    );
  }

  protected syncToThree() {
    this.body.position.set(
      ...this.world.map.localToWorld(this.object.position.clone()).toArray(),
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
}
