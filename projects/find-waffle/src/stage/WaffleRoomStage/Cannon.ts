import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import * as THREE from 'three';

export default class Cannon {
  public world: CANNON.World;
  private bodies: { mesh: THREE.Object3D; body: CANNON.Body }[] = [];

  constructor() {
    this.world = new CANNON.World();
  }

  public wrap(
    targetObjects: THREE.Object3D[],
    scale: number,
    mass: number,
    presetPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
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
      const body = new CANNON.Body({
        mass: mass,
        shape: shape,
        position: new CANNON.Vec3(
          box.min.x * scale + (size.x * scale) / 2 + presetPosition.x,
          box.min.y * scale + (size.y * scale) / 2 + presetPosition.y,
          box.min.z * scale + (size.z * scale) / 2 + presetPosition.z,
        ),
      });

      this.world.addBody(body);
      this.bodies.push({ mesh: obj, body: body });
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
}
