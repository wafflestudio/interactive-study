import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { KeyMap } from '../../../../libs/keyboard/KeyMap';
import { ResourceLoader } from '../../../../libs/resource-loader/ResourceLoader';
import { CannonManager } from '../cannon/CannonManager';
import { ScenarioManager } from '../scenario/ScenarioManager';

export abstract class GameObject {
  public object3D?: THREE.Object3D;
  public body?: CANNON.Body;

  constructor(
    public objectName: string,
    public resourceLoader: ResourceLoader,
    public keyMap: KeyMap,
    public scenarioManager: ScenarioManager,
    public cannonManager: CannonManager,
  ) {}

  static onAnimate: (time: DOMHighResTimeStamp) => void;
  static onUnmount: () => void;
}
