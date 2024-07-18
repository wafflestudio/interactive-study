import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export default class Cannon {
  public world: CANNON.World;
  public bodies: {
    mesh: THREE.Object3D;
    body: CANNON.Body;
    isMovable: boolean;
    boxCenter: THREE.Vector3;
    presetPosition: THREE.Vector3;
  }[] = [];
  private defaultMaterial: CANNON.Material;
  private contactMaterial: CANNON.ContactMaterial;

  constructor() {
    this.world = new CANNON.World();
    this.defaultMaterial = new CANNON.Material('default');
    this.contactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 10.0,
        restitution: 0.0,
        contactEquationRelaxation: 10.0,
        frictionEquationStiffness: 1,
      },
    );
    this.world.addContactMaterial(this.contactMaterial);
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
        material: this.defaultMaterial,
      });

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

  public filterCollision(
    body: CANNON.Body,
    collisionFilterGroup: number,
    collisionFilterMask: number,
  ) {
    body.collisionFilterGroup = collisionFilterGroup;
    body.collisionFilterMask = collisionFilterMask;
  }

  public stopIfCollided() {
    this.world.contacts.forEach((contact) => {
      contact.bi.velocity = new CANNON.Vec3(0, 0, 0);
      contact.bj.velocity = new CANNON.Vec3(0, 0, 0);
      contact.bi.angularVelocity = new CANNON.Vec3(0, 0, 0);
      contact.bj.angularVelocity = new CANNON.Vec3(0, 0, 0);
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
