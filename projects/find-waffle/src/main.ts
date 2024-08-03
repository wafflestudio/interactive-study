import { StageManager } from './core/stage/StageManager';
import TestHomeStage from './example/TestHomeStage';
import WaffleRoomStage from './stage/WaffleRoomStage';
import CardGameStage from './stages/card-game';
import EscapeCubeStage from './stages/escape-cube';
import { GooseStage } from './stages/goose/stage';

// Stages
const stageManager = StageManager.instance;
const gooseStage = new GooseStage(stageManager.renderer, stageManager.app);
const escapeCubeStage = new EscapeCubeStage(
  stageManager.renderer,
  stageManager.app,
);
const cardGame = new CardGameStage(stageManager.renderer, stageManager.app);
const waffleRoom = new WaffleRoomStage(stageManager.renderer, stageManager.app);
const testHome = new TestHomeStage(stageManager.renderer, stageManager.app, [
  gooseStage,
  escapeCubeStage,
  cardGame,
  waffleRoom,
]);

stageManager.setHome(testHome);
window.requestAnimationFrame(() => stageManager.animate());
window.addEventListener('resize', (e) => stageManager.resize(e));

// 디버깅용
stageManager.toStage(gooseStage);
