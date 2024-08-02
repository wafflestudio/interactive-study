import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/Addons.js';

import { World } from '../World';

export class Monster {
  position: THREE.Vector3;
  object: THREE.Mesh<THREE.SphereGeometry, THREE.MeshMatcapMaterial>;
  body: CANNON.Body;
  noise = new SimplexNoise();

  constructor(
    public world: World,
    initialPosition: THREE.Vector3,
  ) {
    this.position = initialPosition.clone();
    // const displacementMap = this.makeDisplacementMap();
    const displacementMap = this.world.loader.getTexture('displacement');
    displacementMap?.repeat.set(2, 1);
    displacementMap!.wrapS = THREE.RepeatWrapping;
    // displacementMap!.wrapT = THREE.RepeatWrapping;
    this.object = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 32, 32),
      new THREE.MeshMatcapMaterial({
        matcap: this.world.loader.getTexture('matcap_roughness_2'),
        // displacementBias: 1,
        // displacementMap: this.makeDisplacementMap(),
        displacementMap,
        displacementScale: 0.2,
      }),
    );
    this.object.quaternion.setFromAxisAngle(
      new THREE.Vector3(1, 1, 1).normalize(),
      Math.PI / 4,
    );

    this.object.position.copy(this.position);
    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(
        this.position.x,
        this.position.y,
        this.position.z,
      ),
    });
    this.body.addShape(new CANNON.Sphere(0.35));
  }

  tick(timeDelta: number) {
    // (this.object.material as THREE.MeshMatcapMaterial).displacementMap
    // this.object.geometry.attributes.position = new THREE.Float32BufferAttribute(
    //   chunk(Array.from(this.object.geometry.attributes.position.array), 3)
    //     .map(([x, y, z]) => {
    //       y += this.noise.noise(x, z) * 0.05;
    //       x += this.noise.noise(y, x) * 0.05;
    //       z += this.noise.noise(z, x) * 0.05;
    //       return [x, y, z];
    //     })
    //     .flat(),
    //   3,
    // );
    if (this.object.material.displacementMap) {
      const offset = this.object.material.displacementMap.offset;
      offset.set(
        (offset.x + timeDelta * 0.1) % 1,
        // (offset.y + timeDelta * 0.1) % 1,
        offset.y,
      );
    }
    // if (this.object.material.displacementMap) {
    //   (this.object.material.displacementMap.source.data as Float32Array).map(
    //     (value, index) => {
    //       return (value + Math.sin(index + timeDelta * 0.01) * 0.01) % 1;
    //     },
    //   );
    // }
  }

  private makeDisplacementMap() {
    const size = 256;
    const data = new Float32Array(size * size);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = (this.noise.noise(i / 50, j / 50) + 1) / 2; // Normalize to [0, 255]
        data[i * size + j] = value;
      }
    }

    const displacementMap = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RedFormat,
      THREE.FloatType,
      THREE.Texture.DEFAULT_MAPPING,
    );
    displacementMap.needsUpdate = true;
    return displacementMap;
  }
}
