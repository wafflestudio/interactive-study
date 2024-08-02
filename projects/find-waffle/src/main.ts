import { StageManager } from './core/stage/StageManager';
import TestBlueStage from './example/TestBlueStage';
import TestHomeStage from './example/TestHomeStage';
import { GooseStage } from './stages/goose/stage';

// Stages
const stageManager = StageManager.instance;
const gooseStage = new GooseStage(stageManager.renderer, stageManager.app);
const testBlue = new TestBlueStage(stageManager.renderer, stageManager.app);
const testHome = new TestHomeStage(stageManager.renderer, stageManager.app, [
  gooseStage,
  testBlue,
]);

stageManager.setHome(testHome);
window.requestAnimationFrame((t) => stageManager.animate(t));
window.addEventListener('resize', (e) => stageManager.resize(e));

// 디버깅용
stageManager.toStage(gooseStage);
