import { StageManager } from './core/stage/StageManager';
import CardGameStage from './stages/card-game';
import { GooseStage } from './stages/goose/stage';
import { HomeStage } from './stages/home/HomeStage';

// Stages
const stageManager = StageManager.instance;

const gooseStage = new GooseStage(stageManager.renderer, stageManager.app);
const cardGame = new CardGameStage(stageManager.renderer, stageManager.app);

const homeStage = new HomeStage(stageManager.renderer, stageManager.app);
stageManager.setHome(homeStage);
stageManager.toHome();

window.requestAnimationFrame(() => stageManager.animate());
window.addEventListener('resize', (e) => stageManager.resize(e));
