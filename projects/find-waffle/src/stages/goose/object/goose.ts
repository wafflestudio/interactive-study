import * as THREE from 'three';

import { CAMERA_HEIGHT, GOOSE_SIZE } from '../constant';

// DEBUG
const GOOSE_WALKING_DENOM = 10000;
const GOOSE_ANIMATION_TERM = 200;

export class Goose {
  object: THREE.Object3D;
  #textureList: THREE.Texture[];
  #material: THREE.SpriteMaterial;
  #walkingSurface: THREE.Object3D;
  #raycaster = new THREE.Raycaster();
  #startTime?: DOMHighResTimeStamp;
  #radius: number;
  #initialAngle: number;

  #prevTime?: number;
  #prevY?: number;

  constructor(
    textureList: THREE.Texture[],
    walkingSurface: THREE.Object3D,
    radius: number,
    initialAngle: number,
  ) {
    this.#textureList = textureList;
    this.#material = new THREE.SpriteMaterial({
      transparent: true,
      map: textureList[0],
    });
    this.object = new THREE.Sprite(this.#material);
    this.object.scale.set(GOOSE_SIZE, GOOSE_SIZE, 1);
    this.#walkingSurface = walkingSurface;
    this.#radius = radius;
    this.#initialAngle = initialAngle;
  }

  animate(time: DOMHighResTimeStamp) {
    if (this.#startTime === undefined) {
      this.#startTime = time;
      return;
    }

    const delta = (time - this.#startTime) / GOOSE_WALKING_DENOM;

    const pos = new THREE.Vector3(
      this.#radius * Math.cos(this.#initialAngle + delta),
      9999,
      this.#radius * Math.sin(this.#initialAngle + delta),
    );

    this.#raycaster.set(pos, new THREE.Vector3(0, -1, 0));
    const intersections = this.#raycaster.intersectObject(this.#walkingSurface);
    if (intersections.length === 0) return;

    const y = intersections[0].point.y + GOOSE_SIZE / 2;
    pos.y = y;
    this.object.position.copy(pos);

    this.#material.map =
      this.#textureList[Math.floor(time / GOOSE_ANIMATION_TERM) % 4];
    this.#material.needsUpdate = true;

    if (this.#prevY && this.#prevTime) {
      const slope = y - this.#prevY;
      // TODO: 계산
      this.#material.rotation = slope * 20;
    }
    this.#prevY = y;
    this.#prevTime = time;
  }
}
