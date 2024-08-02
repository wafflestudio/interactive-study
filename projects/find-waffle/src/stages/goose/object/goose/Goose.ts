import * as THREE from 'three';

import { GOOSE_ANIMATION_TERM, GOOSE_SIZE } from '../../constant';
import { GooseAnimator } from './animator';

export class Goose extends THREE.Group {
  animator: GooseAnimator;
  isClicked = false;

  #textures: THREE.Texture[];
  #loveTexture: THREE.Texture;
  #material: THREE.SpriteMaterial;
  #elapsedTime = 0;

  constructor(
    textures: THREE.Texture[],
    loveTexture: THREE.Texture,
    animator: GooseAnimator,
  ) {
    super();

    this.animator = animator;
    this.#textures = textures;
    this.#loveTexture = loveTexture;
    this.#material = new THREE.SpriteMaterial();

    this.add(new THREE.Sprite(this.#material));
    this.scale.set(GOOSE_SIZE, GOOSE_SIZE, 1);
  }

  animate(time: DOMHighResTimeStamp) {
    const { pos, slope } = this.animator.animate(time);
    this.position.copy(pos);
    this.#material.rotation = slope;

    this.#elapsedTime += time * 1000;
    const textureIdx = Math.floor(this.#elapsedTime / GOOSE_ANIMATION_TERM) % 4;
    this.#material.map = this.#textures[textureIdx];
    this.#material.needsUpdate = true;
  }

  onMouseDown() {
    this.isClicked = true;

    const material = new THREE.SpriteMaterial();
    material.map = this.#loveTexture;
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.5, 0.5, 0.5);
    sprite.position.y += 0.3;

    const id = setInterval(() => {
      sprite.position.y += 0.1;
    }, 100);

    setTimeout(() => {
      clearInterval(id);
      sprite.removeFromParent();
    }, 1500);

    this.add(sprite);
  }
}
