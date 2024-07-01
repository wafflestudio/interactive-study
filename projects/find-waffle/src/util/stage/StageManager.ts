import * as THREE from 'three';

import { Stage } from './Stage';

export class StageManager {
  private static _instance: StageManager;
  public app: HTMLElement;
  public renderer: THREE.WebGLRenderer;
  public home?: Stage;
  public currentStage?: Stage;

  private constructor() {
    this.app = document.querySelector('#app')!;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.app.querySelector('canvas')!,
      antialias: true,
    });
  }

  public static get instance(): StageManager {
    if (!StageManager._instance) {
      StageManager._instance = new StageManager();
    }
    return StageManager._instance;
  }

  public setHome(stage: Stage) {
    if (this.currentStage) return;
    stage.mount();
    this.home = stage;
    this.currentStage = stage;
  }

  public toHome() {
    this.currentStage?.unmount();
    this.home?.mount();
    this.currentStage = this.home;
  }

  public toStage(stage: Stage) {
    this.currentStage?.unmount();
    stage.mount();
    this.currentStage = stage;
  }
}
