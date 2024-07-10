import { StageManager } from './core/stage/StageManager';
import WaffleRoomStage from './stage/WaffleRoomStage';

// Stages
const stageManager = StageManager.instance;

const waffleRoom = new WaffleRoomStage(stageManager.renderer, stageManager.app);

stageManager.setHome(waffleRoom);
window.requestAnimationFrame((t) => stageManager.animate(t));
window.addEventListener('resize', (e) => stageManager.resize(e));
