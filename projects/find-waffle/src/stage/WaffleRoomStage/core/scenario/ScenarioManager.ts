import * as THREE from 'three';

type Plot = {
  name: string;
  onMount: () => void;
  onUnmount: () => void;
};

export class ScenarioManager {
  currentPlot?: Plot;
  plots: Plot[] = [];

  constructor() {}

  addPlot(name: string, onMount: () => {}, onUnmount: () => {}) {
    this.plots.push({ name, onMount, onUnmount });
  }

  changePlot(name: string) {
    const target = this.plots.find((plot) => plot.name === name);
    if (!target) throw new Error(`Plot ${name} not found`);
    if (this.currentPlot) this.currentPlot.onUnmount();
    this.currentPlot = target;
    this.currentPlot.onMount();
  }

  startPlot(name: string) {
    const target = this.plots.find((plot) => plot.name === name);
    if (!target) throw new Error(`Plot ${name} not found`);
    if (this.currentPlot) this.currentPlot.onUnmount();
    this.changePlot(name);
  }

  isPlot(name: string) {
    return this.currentPlot?.name === name;
  }
}
