import * as THREE from 'three';

import { Stage } from './Stage';

export class StageManager {
  private static _instance: StageManager;
  public app: HTMLElement;
  public renderer: THREE.WebGLRenderer;
  public home?: Stage;
  public currentStage?: Stage;
  public readonly clock = new THREE.Clock(false);
  public pauseCallbacks: Array<() => void> = [];
  public playCallbacks: Array<() => void> = [];

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
    this.home = stage;
    this.toHome();
  }

  public toStage(stage: Stage) {
    this.currentStage?.unmount();
    this.pauseCallbacks = [];
    this.playCallbacks = [];
    stage.mount();
    this.play();
    this.currentStage = stage;
  }

  public toHome() {
    if (!this.home) return;
    this.toStage(this.home);
  }

  public animate() {
    const timeDelta = this.clock.getDelta(); // delta seconds
    this.currentStage?.animate(timeDelta);
    window.requestAnimationFrame(() => this.animate());
  }

  public resize(e: Event) {
    this.currentStage?.resize(e);
  }

  public pause() {
    this.clock.stop();
    this.pauseCallbacks.forEach((cb) => cb());
  }

  public addPauseCallback(cb: () => void) {
    this.pauseCallbacks.push(cb);
  }

  public removePauseCallback(cb: () => void) {
    this.pauseCallbacks = this.pauseCallbacks.filter((c) => c !== cb);
  }

  public play() {
    this.clock.start();
    this.playCallbacks.forEach((cb) => cb());
  }

  public addPlayCallback(cb: () => void) {
    this.playCallbacks.push(cb);
  }

  public removePlayCallback(cb: () => void) {
    this.playCallbacks = this.playCallbacks.filter((c) => c !== cb);
  }

  public getFinishStages() {
    return localStorage.getItem('finishStages')?.split(',') ?? [];
  }

  public findFinishStage(key: string) {
    return this.getFinishStages().find(name => name === key);
  }

  public finishStage(key: string) {
    const finishStages = localStorage.getItem('finishStages')?.split(',') ?? [];
    if (finishStages.includes(key)) return;

    finishStages.push(key);
    localStorage.setItem('finishStages', finishStages.join(','));
  }
}
