import * as CANNON from 'cannon-es';
import gsap from 'gsap';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/Addons.js';

import { World } from '../World';
import { BaseObject } from './BaseObject';

export class Monster extends BaseObject<
  THREE.Mesh<THREE.SphereGeometry, THREE.MeshMatcapMaterial>
> {
  position: THREE.Vector3;
  noise = new SimplexNoise();

  constructor(world: World, initialPosition: THREE.Vector3) {
    const displacementMap = world.loader.getTexture('displacement');
    displacementMap?.repeat.set(2, 1);
    displacementMap!.wrapS = THREE.RepeatWrapping;
    const object = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 32, 32),
      new THREE.MeshMatcapMaterial({
        matcap: world.loader.getTexture('matcap_roughness_2'),
        displacementMap,
        displacementScale: 0.2,
      }),
    );
    object.quaternion.setFromAxisAngle(
      new THREE.Vector3(1, 1, 1).normalize(),
      Math.PI / 4,
    );

    object.position.copy(initialPosition);
    const body = new CANNON.Body({
      mass: 0,
      linearFactor: new CANNON.Vec3(1, 1, 0),
      angularFactor: new CANNON.Vec3(1, 1, 1),
      position: new CANNON.Vec3(
        initialPosition.x,
        initialPosition.y,
        initialPosition.z,
      ),
    });
    body.addShape(new CANNON.Sphere(0.35));
    super(world, object, body);
    this.position = initialPosition.clone();
    body.addEventListener('collide', (e: any) => {
      const contact = e.contact as CANNON.ContactEquation;
      const player = world.player;
      if (e.body === player.body) {
        const playerBody = contact.bi;
        const playerDirection = contact.ri;
        playerBody.velocity.set(
          playerDirection.x * -10,
          playerDirection.y * -10,
          0,
        );
      }
    });

    const helper = { t: 0 };
    gsap.to(helper, {
      t: 1,
      duration: 2,
      onUpdate: function () {
        object.scale.setScalar(helper.t);
        (body.shapes[0] as CANNON.Sphere).radius = 0.35 * helper.t;
      },
    });
  }

  public animate(timeDelta: number) {
    this.syncToThree();
    if (this.object.material.displacementMap) {
      const offset = this.object.material.displacementMap.offset;
      offset.set((offset.x + timeDelta * 0.3) % 1, offset.y);
    }
  }
}
