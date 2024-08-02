import * as THREE from 'three';

import { GooseIcon } from './Icon';

export class GooseFolderIcon extends GooseIcon {
  constructor(texture: THREE.Texture) {
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });
    const mesh = new THREE.Sprite(material);
    mesh.scale.set(0.8, 0.8, 0.8);
    mesh.rotateY(-Math.PI / 2);
    super(mesh, 'My Folder');
  }
}
