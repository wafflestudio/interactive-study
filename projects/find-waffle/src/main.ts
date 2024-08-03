import { StageManager } from './core/stage/StageManager';
import TestBlueStage from './example/TestBlueStage';
import TestHomeStage from './example/TestHomeStage';
import CardGameStage from './stages/card-game';
import { GooseStage } from './stages/goose/stage';

// Stages
const stageManager = StageManager.instance;
const gooseStage = new GooseStage(stageManager.renderer, stageManager.app);
const cardGame = new CardGameStage(stageManager.renderer, stageManager.app);
const testBlue = new TestBlueStage(stageManager.renderer, stageManager.app);
const testHome = new TestHomeStage(stageManager.renderer, stageManager.app, [
  gooseStage,
  cardGame,
]);

stageManager.setHome(testHome);
window.requestAnimationFrame(() => stageManager.animate());
window.addEventListener('resize', (e) => stageManager.resize(e));
