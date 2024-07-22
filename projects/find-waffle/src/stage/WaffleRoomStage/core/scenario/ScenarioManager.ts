import * as THREE from 'three';

type Plot = {
  name: string;
  onMount: (renderer: THREE.WebGLRenderer, camera: THREE.Camera) => void;
  onUnmount: (renderer: THREE.WebGLRenderer, camera: THREE.Camera) => void;
};

export class ScenarioManager {
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  plots: Plot[] = [];
  currentPlot?: Plot;

  constructor(renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
    this.renderer = renderer;
    this.camera = camera;
  }

  addPlot(
    name: string,
    onMount: (renderer: THREE.WebGLRenderer, camera: THREE.Camera) => {},
    onUnmount: (renderer: THREE.WebGLRenderer, camera: THREE.Camera) => {},
  ) {
    this.plots.push({ name, onMount, onUnmount });
  }

  changePlot(name: string) {
    const target = this.plots.find((plot) => plot.name === name);
    if (!target) throw new Error(`Plot ${name} not found`);
    if (this.currentPlot)
      this.currentPlot.onUnmount(this.renderer, this.camera);
    this.currentPlot = target;
    this.currentPlot.onMount(this.renderer, this.camera);
  }

  startPlot(name: string) {
    const target = this.plots.find((plot) => plot.name === name);
    if (!target) throw new Error(`Plot ${name} not found`);
    this.currentPlot = target;
    this.currentPlot.onMount(this.renderer, this.camera);
  }

  isPlot(name: string) {
    return this.currentPlot?.name === name;
  }
}
