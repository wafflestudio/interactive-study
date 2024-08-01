import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { World } from '../World';

const xAxis = new THREE.Vector3(1, 0, 0);
const yAxis = new THREE.Vector3(0, 1, 0);
const zAxis = new THREE.Vector3(0, 0, 1);

export class Player {
  object: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  body: CANNON.Body;
  private direction = new THREE.Vector3();
  private speed = 5;

  constructor(public world: World) {
    const initialPosition = [-4, 5, 5] as const;

    const geometry = new THREE.SphereGeometry(0.3);
    const material = new THREE.MeshStandardMaterial({
      color: 0xadadee,
      format: THREE.RGBAFormat,
    });
    this.object = new THREE.Mesh(geometry, material);
    this.object.renderOrder = 1;
    this.object.castShadow = true;
    this.object.name = 'player';
    this.object.position.set(...initialPosition);
    world.map.add(this.object);

    this.body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(0.3),
      linearDamping: 0,
      linearFactor: new CANNON.Vec3(1, 1, 0),
      angularFactor: new CANNON.Vec3(0, 0, 0),
    });
    this.body.position.set(...initialPosition);
    this.world.cannonWorld.addBody(this.body);
    this.world.cannonWorld.addEventListener('postStep', () => {
      this.updateVelocity();
    });
  }

  get velocity() {
    return this.body.velocity;
  }

  get position() {
    return this.body.position;
  }

  get isSleep() {
    return this.body.sleepState === CANNON.Body.SLEEPING;
  }

  private updateVelocity() {
    this.velocity.set(
      ...this.direction
        .clone()
        .normalize()
        .multiplyScalar(this.speed)
        .toArray(),
    );
  }

  public setDirection(direction: { x?: number; y?: number; z?: number }) {
    const {
      x = this.direction.x,
      y = this.direction.y,
      z = this.direction.z,
    } = direction;
    this.direction.set(x, y, z);
    this.updateVelocity();
  }

  private syncToCannon() {
    this.object.position.copy(
      this.world.map.worldToLocal(
        new THREE.Vector3(...this.body.position.toArray()),
      ),
    );
  }

  private syncToThree() {
    this.body.position.set(
      ...this.world.map.localToWorld(this.object.position.clone()).toArray(),
    );
  }

  public animate() {
    if (this.isSleep) {
      // sleep 일 때는 물리 세계가 threejs 세계를 모방
      this.syncToThree();
      return;
    } else {
      // sleep 이 아닐 때는 threejs 세계가 물리 세계를 모방
      this.syncToCannon();
    }
    if (this.position.x > 5.001) {
      this.position.x = 5;
      this.syncToCannon();
      this.world.rotate(yAxis, -90);
    }
    if (this.position.x < -5.001) {
      this.position.x = -5;
      this.syncToCannon();
      this.world.rotate(yAxis, 90);
    }
    if (this.position.y > 6.001) {
      this.position.y = 6;
      this.syncToCannon();
      this.world.rotate(zAxis, 90);
    }
  }

  public dispose() {
    this.object.removeFromParent();
    this.world.cannonWorld.removeBody(this.body);
  }

  public pause() {
    this.body.sleep();
  }

  public resume() {
    this.body.wakeUp();
  }
}
