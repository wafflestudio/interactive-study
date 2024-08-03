import { noop } from 'es-toolkit';
import * as THREE from 'three';

export abstract class Stage {
  public unmountListener: () => void = noop;

  constructor(
    public renderer: THREE.WebGLRenderer,
    public app: HTMLElement,
  ) {}
  abstract mount(): void;
  unmount(): void {
    this.unmountListener();
  };
  abstract animate(time: DOMHighResTimeStamp): void;
  abstract resize(e: Event): void;
}
