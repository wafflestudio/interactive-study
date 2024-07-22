import { KeyMap } from '../../../libs/keyboard/KeyMap';
import { ResourceLoader } from '../../../libs/resource-loader/ResourceLoader';
import { CannonManager } from '../core/cannon/CannonManager';
import { GameObject } from '../core/object/GameObject';
import { ScenarioManager } from '../core/scenario/ScenarioManager';

export class Player extends GameObject {
  constructor(
    resourceLoader: ResourceLoader,
    keyMap: KeyMap,
    scenarioManager: ScenarioManager,
    cannonManager: CannonManager,
  ) {
    super('Player', resourceLoader, keyMap, scenarioManager, cannonManager);
  }

  onAnimate(time: DOMHighResTimeStamp) {
    console.log(time);
  }

  onUnmount() {
    console.log(`${this.objectName} unmounted`);
  }
}
