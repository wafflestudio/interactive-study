import * as CANNON from 'cannon-es';
import { zip } from 'es-toolkit';
import * as THREE from 'three';
import { Font, TextGeometry } from 'three/examples/jsm/Addons.js';

import { WaffleWorld } from '../World';
import { BaseObject } from './BaseObject';

export class Timer extends BaseObject<THREE.Group> {
  private timeText = '0:00';
  private remainingTime = 180;
  private positions = [
    new THREE.Vector3(-1.2, -4.6, -6),
    new THREE.Vector3(-2.2, -3.8, -6),
    new THREE.Vector3(-3.1, -4.8, -6),
    new THREE.Vector3(-3.8, -4.2, -6),
  ];
  private textObjects: THREE.Mesh<TextGeometry, THREE.MeshBasicMaterial>[] = [];
  paused = true;

  constructor(
    world: WaffleWorld,
    private font: Font,
    matcap: THREE.Texture,
  ) {
    super(world, new THREE.Group(), new CANNON.Body());
    const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const sphereMaterial = new THREE.MeshMatcapMaterial({ matcap });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    const textGeometry = new TextGeometry('', { font });
    const textMaterial = new THREE.MeshBasicMaterial({
      color: 'white',
    });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    for (const position of this.positions) {
      const sphereObject = sphere.clone();
      sphereObject.position.copy(position);
      const textObject = text.clone();
      textObject.rotation.set(0, Math.PI, 0);
      sphereObject.add(textObject);
      this.textObjects.push(textObject);
      this.object.add(sphereObject);
    }
    this.updateTextObjects();
  }

  pause() {
    this.paused = true;
  }

  start() {
    this.paused = false;
  }

  increase(time: number) {
    this.remainingTime += time;
    this.timeText = this.formatTime(this.remainingTime);
    this.updateTextObjects();
  }

  decrease(time: number) {
    this.remainingTime = Math.max(this.remainingTime - time, 0);
    this.timeText = this.formatTime(this.remainingTime);
    this.updateTextObjects();
  }

  public animate(timeDelta: number) {
    if (this.paused) return;
    this.remainingTime = Math.max(this.remainingTime - timeDelta, 0);
    const newText = this.formatTime(this.remainingTime);
    if (newText !== this.timeText) {
      this.timeText = newText;
      this.updateTextObjects();
    }
    if (this.remainingTime === 0) {
      this.pause();
      this.world.pause();
    }
  }

  private formatTime(time: number) {
    const minutes = Math.floor(time / 60)
      .toString()
      .slice(-1);
    const seconds = Math.ceil(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  private updateTextObjects() {
    if (this.timeText.length !== this.textObjects.length) {
      console.error(
        `Length mismatch, ${this.timeText.length} != ${this.textObjects.length}`,
      );
      return;
    }
    zip(this.timeText.split(''), this.textObjects).forEach(
      ([char, textObject]) => {
        const newGeometry = new TextGeometry(char, {
          font: this.font,
          size: 0.5,
          depth: 0.1,
          curveSegments: 4,
        });
        textObject.geometry = newGeometry;
        newGeometry.computeBoundingBox();
        const boundingBox = newGeometry.boundingBox!;
        const xOffset = (boundingBox.max.x + boundingBox.min.x) / 2;
        const yOffset = (boundingBox.max.y + boundingBox.min.y) / 2;
        textObject.position.set(xOffset, -yOffset, -0.5);
      },
    );
  }
}
