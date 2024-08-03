import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { World } from '../World';
import { BaseObject } from './BaseObject';

const xAxis = new THREE.Vector3(1, 0, 0);
const yAxis = new THREE.Vector3(0, 1, 0);
const zAxis = new THREE.Vector3(0, 0, 1);

export class Player extends BaseObject<THREE.Group> {
  private direction = new CANNON.Vec3();

  constructor(world: World) {
    const initialPosition = [-4, 5, 5] as const;

    const object = world.loader.getModel('player_start')!.scene;
    object.castShadow = true;
    object.name = 'player';
    object.position.set(...initialPosition);

    const body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(0.3),
      linearDamping: 0.95,
      linearFactor: new CANNON.Vec3(1, 1, 0),
      angularFactor: new CANNON.Vec3(0, 0, 0),
    });
    body.position.set(...initialPosition);
    world.cannonWorld.addEventListener('preStep', () => {
      if (this.isSleep) return;
      this.body.applyForce(this.direction.scale(10), this.position);
    });
    world.cannonWorld.addEventListener('postStep', () => {
      this.rollForward();
    });
    super(world, object, body);
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

  private rollForward() {
    const displacement = this.body.position.vsub(this.body.previousPosition);
    const distance = displacement.length();
    const rotateAxis = new THREE.Vector3(
      -displacement.y,
      displacement.x,
      0,
    ).applyQuaternion(this.world.map.mapObject.quaternion.clone().invert());

    const q = new THREE.Quaternion().setFromAxisAngle(
      rotateAxis.normalize(),
      distance * 2,
    );
    this.object.applyQuaternion(q);
  }

  public setDirection(direction: { x?: number; y?: number; z?: number }) {
    const {
      x = this.direction.x,
      y = this.direction.y,
      z = this.direction.z,
    } = direction;
    this.direction.set(x, y, z);
  }

  public animate(timeDelta: number) {
    super.animate(timeDelta);
    if (this.position.x > 5.001) {
      this.position.x = 5;
      this.syncToCannon();
      this.world.map.rotate(yAxis, -90);
    }
    if (this.position.x < -5.001) {
      this.position.x = -5;
      this.syncToCannon();
      this.world.map.rotate(yAxis, 90);
    }
    if (this.position.y > 6.001) {
      this.position.y = 6;
      this.syncToCannon();
      this.world.map.rotate(zAxis, 90);
    }
  }

  public dispose() {
    this.object.removeFromParent();
    this.world.cannonWorld.removeBody(this.body);
  }

  public pause() {
    this.velocity.setZero();
    this.body.sleep();
  }

  public resume() {
    this.body.wakeUp();
  }
}
