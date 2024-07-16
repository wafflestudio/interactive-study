import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import * as THREE from 'three';

export default class Cannon {
  public world: CANNON.World;

  constructor() {
    this.world = new CANNON.World();
  }

  public wrap(targetObjects: THREE.Object3D[], scale: number, mass: number) {
    targetObjects.forEach((obj) => {
      console.log(obj);
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
        position: new CANNON.Vec3(
          box.min.x * scale + (size.x * scale) / 2,
          box.min.y * scale + (size.y * scale) / 2,
          box.min.z * scale + (size.z * scale) / 2,
        ),
        shape: shape,
      });
      this.world.addBody(body);
    });
  }
}
