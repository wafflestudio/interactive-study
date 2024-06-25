import * as THREE from 'three';

export default abstract class Stage {
  constructor(
    public renderer: THREE.WebGLRenderer,
    public app: HTMLElement,
  ) {}
  abstract mount(): void;
  abstract unmount(): void;
}
