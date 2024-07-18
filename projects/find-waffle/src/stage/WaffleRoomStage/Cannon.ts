import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export default class Cannon {
  public world: CANNON.World;
  private bodies: {
    mesh: THREE.Object3D;
    body: CANNON.Body;
    isMovable: boolean;
    boxCenter: THREE.Vector3;
    presetPosition: THREE.Vector3;
  }[] = [];

  constructor() {
    this.world = new CANNON.World();
  }

  public wrap(
    targetObjects: THREE.Object3D[],
    scale: number,
    mass: number,
    presetPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    isMovable: boolean = false,
  ) {
    const bodies = targetObjects.map((obj) => {
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      box.getSize(size);

      const shape = new CANNON.Box(
        new CANNON.Vec3(
          (size.x * scale) / 2,
          (size.y * scale) / 2,
          (size.z * scale) / 2,
        ),
      );
      const boxCenter = new THREE.Vector3(
        box.min.x * scale + (size.x * scale) / 2,
        box.min.y * scale + (size.y * scale) / 2,
        box.min.z * scale + (size.z * scale) / 2,
      );
      const body = new CANNON.Body({
        mass: mass,
        shape: shape,
        position: new CANNON.Vec3(
          boxCenter.x + presetPosition.x,
          boxCenter.y + presetPosition.y,
          boxCenter.z + presetPosition.z,
        ),
      });
      console.log(boxCenter);

      this.world.addBody(body);

      const flagMovable = isMovable;

      this.bodies.push({
        mesh: obj,
        body: body,
        isMovable: flagMovable,
        boxCenter: boxCenter,
        presetPosition: presetPosition,
      });
      return body;
    });
    return bodies;
  }

  public updateBodies() {
    this.bodies.forEach(({ mesh, body }) => {
      const box = new THREE.Box3().setFromObject(mesh);
      const center = new THREE.Vector3();
      box.getCenter(center);

      body.position.set(center.x, center.y, center.z);
    });
  }

  public renderMovement() {
    this.bodies.forEach(({ mesh, body, isMovable, boxCenter }) => {
      if (!isMovable) return;
      const newPosition = new THREE.Vector3(
        body.position.x - boxCenter.x,
        body.position.y - boxCenter.y,
        body.position.z - boxCenter.z,
      );
      mesh.position.copy(newPosition);
      mesh.quaternion.copy(
        new THREE.Quaternion(
          body.quaternion.x,
          body.quaternion.y,
          body.quaternion.z,
          body.quaternion.w,
        ),
      );
    });
  }
}
