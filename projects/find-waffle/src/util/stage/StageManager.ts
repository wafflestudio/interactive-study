import Stage from './Stage';

export default class StageManager {
  private static _instance: StageManager;
  public home?: Stage;
  public currentStage?: Stage;

  private constructor() {}

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
