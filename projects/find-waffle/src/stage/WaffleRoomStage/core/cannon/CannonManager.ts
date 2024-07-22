/**
 * totalObjects: 게임 내 생성되는 모든 오브젝트를 가리킵니다.
 * Bodies: CANNON.js의 Body를 가리킵니다.
 * Mesh: THREE.js의 Object3D를 가리킵니다.
 * InteractiveHitbox: 캐릭터 오브젝트와 상호작용하는 hitbox(cannon body)를 가리킵니다.
 */
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

type InteractiveHitbox = {
  mesh: THREE.Object3D;
  body: CANNON.Body;
  margin: number;
  activatedSubstage: number;
  onActivate: (contact: CANNON.ContactEquation) => void;
};

type IndividualObject = {
  mesh: THREE.Object3D;
  body: CANNON.Body;
  isMovable: boolean;
  boxCenter: THREE.Vector3;
  presetPosition: THREE.Vector3;
};

export class CannonManager {
  public world: CANNON.World;
  public bodies: {
    mesh: THREE.Object3D;
    body: CANNON.Body;
    isMovable: boolean;
    boxCenter: THREE.Vector3;
    presetPosition: THREE.Vector3;
  }[] = [];
  public interactiveHitboxMap: Map<string, InteractiveHitbox> = new Map();
  public totalObjectMap: Map<string, IndividualObject> = new Map();

  constructor() {
    this.world = new CANNON.World({});
  }

  /**
   * THREE.js의 Object3D를 CANNON.js의 Body로 wrapping합니다.
   */
  public wrap(
    targetMeshes: THREE.Object3D[],
    scale: number,
    mass: number,
    presetPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    isMovable: boolean = false,
  ) {
    const bodies = targetMeshes.map((obj) => {
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

      this.world.addBody(body);

      this.totalObjectMap.set(obj.name, {
        mesh: obj,
        body: body,
        isMovable: isMovable,
        boxCenter: boxCenter,
        presetPosition: presetPosition,
      });
      return body;
    });
    console.log(this.totalObjectMap);
    return bodies;
  }

  public createInteractiveHitbox(
    targetMesh: THREE.Object3D,
    margin: number,
    onActivate: (contact: CANNON.ContactEquation) => void,
  ) {
    const targetObject = this.totalObjectMap.get(targetMesh.name);
    if (!targetObject) return;
    const originalShape = targetObject.body.shapes[0] as CANNON.Box;
    const hitboxBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(
        new CANNON.Vec3(
          originalShape.halfExtents.x + margin,
          originalShape.halfExtents.y + margin,
          originalShape.halfExtents.z + margin,
        ),
      ),
      position: targetObject.body.position,
    });
    this.world.addBody(hitboxBody);

    this.interactiveHitboxMap.set(targetMesh.name, {
      mesh: targetMesh,
      body: hitboxBody,
      margin: margin,
      activatedSubstage: 0,
      onActivate: onActivate,
    });
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
      console.log('contact');
      contact.bi.velocity = new CANNON.Vec3(0, 0, 0);
      contact.bj.velocity = new CANNON.Vec3(0, 0, 0);
      contact.bi.angularVelocity = new CANNON.Vec3(0, 0, 0);
      contact.bj.angularVelocity = new CANNON.Vec3(0, 0, 0);
    });
  }

  public renderMovement() {
    this.totalObjectMap.forEach(({ mesh, body, isMovable, boxCenter }) => {
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
