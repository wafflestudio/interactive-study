import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/Addons.js';

import { loadFont } from '../../util/loader';

export class GooseIcon extends THREE.Group {
  #label?: THREE.Mesh<
    TextGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >;

  constructor(object: THREE.Object3D, iconName: string) {
    super();
    this.add(object);
    this.setLabel(iconName);
  }

  moveTo(vec: THREE.Vector3Like) {
    this.position.copy(vec);
  }

  onMouseDown() {
    this.expand();
  }

  onMouseMove(vec: THREE.Vector3Like, _e: MouseEvent) {
    this.position.copy(vec);
  }

  onMouseUp() {
    this.shrink();
  }

  expand() {
    // TODO: 카메라와 가까운 쪽으로 이동
    this.scale.set(1.1, 1.1, 1.1);
  }

  shrink() {
    this.scale.set(1, 1, 1);
  }

  async setLabel(str: string, angle?: number) {
    const font = await loadFont('/goose/font.json');

    const geometry = new TextGeometry(str, { font, size: 0.15, depth: 0.02 });
    geometry.computeBoundingBox();
    geometry.translate(-geometry.boundingBox!.max.x / 2, 0, 0);

    if (this.#label) {
      this.#label.geometry = geometry;
      if (angle) this.#label.rotateY(angle);
      return;
    }

    const material = new THREE.MeshBasicMaterial({ color: 'white' });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.y -= 0.55;

    mesh.rotateY(-Math.PI / 2);

    if (angle) mesh.rotateY(angle);
    this.add(mesh);

    this.#label = mesh;
  }
}
