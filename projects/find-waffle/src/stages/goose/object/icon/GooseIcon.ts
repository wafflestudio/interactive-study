import * as THREE from 'three';

import { GooseIcon } from './Icon';

export class GooseGooseIcon extends GooseIcon {
  addGoose: () => void = () => {};

  constructor(texture: THREE.Texture) {
    const material = new THREE.SpriteMaterial();
    material.map = texture;

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.7, 0.7, 0.7);

    super(sprite, 'Goose');
  }

  onMouseDown() {
    super.onMouseDown();
    this.addGoose();
  }

  onMouseMove(_vec: THREE.Vector3Like, _e: MouseEvent): void {
    return;
  }
}
