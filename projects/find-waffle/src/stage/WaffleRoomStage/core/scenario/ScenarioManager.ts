export type Plot = {
  name: string;
  onMount?: () => void;
  onUnmount?: () => void;
};

export type Scenario = (set: (name: string) => void) => Plot[];

export class ScenarioManager {
  plots: Plot[] = [];
  currentPlot: Plot | null = null;

  constructor() {}

  add(plot: Plot) {
    this.plots.push(plot);
  }

  addScenario(scenario: Scenario) {
    this.plots.push(...scenario(this.set.bind(this)));
  }

  set(name: string) {
    console.log('set: ', name);
    const target = this.plots.find((plot) => plot.name === name);
    if (!target) throw new Error(`Plot ${name} not found`);
    if (this.currentPlot) this.currentPlot.onUnmount?.();
    this.currentPlot = target;
    this.currentPlot.onMount?.();
  }

  isPlot(name: string | undefined | null) {
    if (!this.currentPlot) return false;
    return this.currentPlot.name === name;
  }
}
