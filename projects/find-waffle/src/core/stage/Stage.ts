import * as THREE from 'three';

export abstract class Stage {
  constructor(
    public renderer: THREE.WebGLRenderer,
    public app: HTMLElement,
  ) {}
  abstract mount(): void;
  abstract unmount(): void;
  abstract animate(time: DOMHighResTimeStamp): void;
  abstract resize(e: Event): void;
}
