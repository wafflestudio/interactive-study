import * as THREE from 'three';

import {
  CAMERA_FOV,
  CAMERA_HEIGHT,
  WINDOW_DIST,
  WINDOW_GAP,
  WINDOW_ICON_SIZE,
} from '../constant';
import { GooseRaycaster } from '../raycaster';
import { GooseWindowIcon } from './icon';

export class GooseWindow {
  object: THREE.Object3D;
  #iconList: GooseWindowIcon[] = [];
  #raycaster: GooseRaycaster;
  #radianAngle: number;
  #dragginIcon?: GooseWindowIcon;

  constructor(radianAngle: number, raycaster: GooseRaycaster) {
    this.#radianAngle = radianAngle;
    this.#raycaster = raycaster;

    this.object = this.#createObject();
    this.object.position.set(
      WINDOW_DIST * Math.cos(radianAngle),
      CAMERA_HEIGHT,
      WINDOW_DIST * Math.sin(radianAngle),
    );
    this.object.lookAt(0, CAMERA_HEIGHT, 0);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    addEventListener('mousedown', this.handleMouseDown);
  }

  get width() {
    return this.object.scale.x;
  }

  set width(newValue) {
    this.object.scale.x = newValue;
  }

  get height() {
    return this.object.scale.y;
  }

  set height(newValue) {
    this.object.scale.y = newValue;
  }

  fitCanvas() {
    const aspect = innerWidth / innerHeight;
    const fovInDegree = (CAMERA_FOV * Math.PI) / 180;
    this.height = 2 * Math.tan(fovInDegree / 2) * WINDOW_DIST;
    this.width = this.height * aspect;
  }

  resize() {
    this.fitCanvas();

    this.#iconList.forEach((icon, idx) => {
      //
    });
  }

  register(...iconList: GooseWindowIcon[]) {
    this.fitCanvas();

    iconList.forEach((icon) => {
      const idx = this.#iconList.length;
      this.#iconList.push(icon);

      let yPadding = this.height / 10;
      let y = CAMERA_HEIGHT + this.height / 2 - yPadding;
      y -= idx * (WINDOW_ICON_SIZE + WINDOW_GAP);

      let zPadding = this.width / 10;
      let z = -this.width / 2 + zPadding;

      icon.moveTo({ x: WINDOW_DIST, y, z });
    });
  }

  handleMouseDown(e: MouseEvent) {
    const intersectionList = this.#raycaster.intersectObjects(
      this.#iconList.map((icon) => icon.object),
    );
    if (intersectionList.length === 0) return;

    const object = intersectionList[0].object;
    this.#dragginIcon = this.#iconList.find((icon) => icon.object === object);
    this.#dragginIcon?.onMouseDown();

    addEventListener('mousemove', this.handleMouseMove);
    addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove({ clientX }: MouseEvent) {
    const intersectionList = this.#raycaster.intersectObject(this.object);
    if (intersectionList.length === 0) return;
    const intersection = intersectionList[0].point;
    this.#dragginIcon?.moveTo(intersection);
  }

  handleMouseUp() {
    removeEventListener('mousemove', this.handleMouseMove);
    removeEventListener('mouseup', this.handleMouseUp);
    this.#dragginIcon?.onMouseUp();
  }

  #createObject() {
    const geometry = new THREE.PlaneGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.FrontSide,
      opacity: 0.1,
      transparent: true,
    });
    return new THREE.Mesh(geometry, material);
  }
}
