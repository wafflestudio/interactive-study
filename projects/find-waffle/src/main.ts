import TestBlueStage from './example/TestBlueStage';
import TestHomeStage from './example/TestHomeStage';
import TestYellowStage from './example/TestYellowStage';
import StageManager from './util/stage/StageManager';

// Stages
const stageManager = StageManager.instance;
const testYellow = new TestYellowStage(stageManager.renderer, stageManager.app);
const testBlue = new TestBlueStage(stageManager.renderer, stageManager.app);
const testHome = new TestHomeStage(stageManager.renderer, stageManager.app, [
  testYellow,
  testBlue,
]);

stageManager.setHome(testHome);
