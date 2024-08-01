import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/Addons.js';

import { RotationManager } from '../../util/RotationManager';
import { GooseIcon } from './Icon';

export class MirrorIcon extends GooseIcon {
  #rotationManager = new RotationManager({
    multiplierX: 0.8,
    multiplierY: 0,
    reversed: true,
  });

  #rainbowMesh: THREE.Mesh;

  constructor(texture: THREE.Texture) {
    const group = new THREE.Group();

    const ringGeometry = new THREE.RingGeometry(0.1, 0.35);

    const rainbowMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    const rainbowMesh = new THREE.Mesh(ringGeometry, rainbowMaterial);
    rainbowMesh.rotateY(-Math.PI / 2);
    rainbowMesh.position.x -= 0.01;

    const front = new Reflector(ringGeometry, {
      clipBias: 0.003,
      color: 0xffffff,
      textureWidth: 156,
      textureHeight: 156,
    });
    front.rotateY(-Math.PI / 2);

    const back = new Reflector(ringGeometry, {
      clipBias: 0.003,
      color: 0xffffff,
      textureWidth: 1024,
      textureHeight: 1024,
    });
    back.rotateY(Math.PI / 2);
    back.position.x += 0.01;

    group.add(rainbowMesh, front, back);

    super(group, 'DVD');

    this.#rainbowMesh = rainbowMesh;
  }

  onMouseMove(_vec: THREE.Vector3Like, e: MouseEvent): void {
    this.#rotationManager.onMouseMove(e, this);
    this.#rainbowMesh.rotation.x = this.rotation.y / 3;
  }

  onMouseUp(): void {
    super.onMouseUp();
    this.#rotationManager.onMouseUp();
  }
}
