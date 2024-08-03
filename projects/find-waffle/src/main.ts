import { StageManager } from './core/stage/StageManager';
import { HomeStage } from './stages/home/HomeStage';

// Stages
const stageManager = StageManager.instance;

const homeStage = new HomeStage(stageManager.renderer, stageManager.app);
stageManager.setHome(homeStage);
stageManager.toHome();

window.requestAnimationFrame(() => stageManager.animate());
window.addEventListener('resize', (e) => stageManager.resize(e));
