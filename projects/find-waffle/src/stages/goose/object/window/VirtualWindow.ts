import * as THREE from 'three';

import { CAMERA_FOV, CAMERA_HEIGHT, WINDOW_DIST } from '../../constant';
import { GooseIcon } from '../icon/Icon';

export class GooseVirtualWindow extends THREE.Mesh {
  #iconList: GooseIcon[] = [];
  #angle: number;

  constructor(angle: number) {
    const gemoetry = new THREE.PlaneGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.1,
      transparent: true,
      // 겹쳐진 아이콘의 clipping 방지
      depthWrite: false,
    });
    super(gemoetry, material);

    this.#angle = angle;
    this.position.set(
      WINDOW_DIST * Math.cos(angle),
      CAMERA_HEIGHT,
      WINDOW_DIST * Math.sin(angle),
    );
    this.lookAt(0, CAMERA_HEIGHT, 0);
  }

  get width() {
    return this.scale.x;
  }

  set width(newValue) {
    this.scale.x = newValue;
  }

  get height() {
    return this.scale.y;
  }

  set height(newValue) {
    this.scale.y = newValue;
  }

  /** 카메라부터의 거리와 FOV를 고려해 화면이 캔버스와 크기가 같도록 조절합니다. */
  resize(canvasRect: DOMRect) {
    const aspect = canvasRect.width / canvasRect.height;
    this.height = 2 * Math.tan(CAMERA_FOV / 2) * WINDOW_DIST;
    this.width = this.height * aspect;
  }

  /** resize 때 위치를 조절할 icon을 등록하고 초기 위치를 설정합니다. */
  registerIcon(...iconList: GooseIcon[]) {
    iconList.forEach((icon) => {
      this.#iconList.push(icon);
      // TODO: 매직 넘버 손보기
      this.#moveIcon(icon, 0.15 * (this.#iconList.length - 1) + 0.3, 0.5);
    });
  }

  /** 상대 좌표를 통해 아이콘을 이동시킵니다. */
  #moveIcon(icon: GooseIcon, left: number, top: number) {
    const pos = new THREE.Vector3(WINDOW_DIST, CAMERA_HEIGHT, 0)
      .add({ x: 0, y: -this.height / 2, z: -this.width / 2 })
      .add({ x: 0, y: this.height * (1 - top), z: this.width * left })
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.#angle);
    icon.moveTo(pos);
    icon.rotateY(this.#angle);
  }
}
