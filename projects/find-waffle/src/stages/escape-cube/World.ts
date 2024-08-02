import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import { Map } from './map/Map';
import { Monster } from './object/Monster';
import { Player } from './object/Player';
import { Timer } from './object/Timer';

export class World {
  cannonWorld = new CANNON.World();
  loader: ResourceLoader = new ResourceLoader();
  map: Map;
  player: Player;
  timer?: Timer;
  initialized = false;
  _monster?: Monster; // 디버깅용 몬스터
  _onInitialized: () => void = () => {};

  set onInitialized(value: () => void) {
    this._onInitialized = value;
    if (this.initialized) {
      this._onInitialized();
    }
  }

  constructor(public scene: THREE.Scene) {
    this.map = new Map(this);
    this.player = new Player(this);
    this.initCannonWorld();
    this.init();
  }

  private initCannonWorld() {
    this.cannonWorld.broadphase = new CANNON.NaiveBroadphase();
    (this.cannonWorld.solver as CANNON.GSSolver).iterations = 10;
  }

  private init() {
    this.map.init().then(() => {
      this.initTimer();
      this.initialized = true;
      this._onInitialized();

      const m = new Monster(this, new THREE.Vector3(0, 5, 5));
      this._monster = m;
    });
  }

  private initTimer() {
    this.timer = new Timer(
      this,
      this.loader.getFont('helvetiker')!,
      this.loader.getTexture('matcap_roughness_4')!,
    );
    this.timer.start();
  }

  public dispose() {
    this.map.dispose();
    this.player.dispose();
    this.timer?.dispose();
  }

  public animate(timeDelta: number) {
    this.player.animate();
    this.cannonWorld.step(1 / 60, timeDelta);
    this.timer?.tick(timeDelta);
    this._monster?.tick(timeDelta);
  }

  public pause() {
    this.player.pause();
  }

  public resume() {
    this.player.resume();
  }
}
