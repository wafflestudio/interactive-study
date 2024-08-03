import * as CANNON from 'cannon-es';
import gsap, * as GSAP from 'gsap';
import * as THREE from 'three';

import { noop } from 'es-toolkit';
import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import { Map } from './map/Map';
import { Monster } from './object/Monster';
import { Player } from './object/Player';
import { Timer } from './object/Timer';
import { Waffle } from './object/Waffle';

export class WaffleWorld {
  cannonWorld = new CANNON.World();
  loader: ResourceLoader = new ResourceLoader();
  map: Map;
  player?: Player;
  timer?: Timer;
  waffle?: Waffle;
  initialized = false;
  monsters: Monster[] = [];
  cannonTimeline = gsap.timeline();
  _onInitialized: () => void = noop;

  set onInitialized(value: () => void) {
    this._onInitialized = value;
    if (this.initialized) {
      this._onInitialized();
    }
  }

  constructor(public scene: THREE.Scene) {
    this.map = new Map(this);
    this.initCannonWorld();
    this.init();
  }

  private initCannonWorld() {
    this.cannonWorld.broadphase = new CANNON.NaiveBroadphase();
    (this.cannonWorld.solver as CANNON.GSSolver).iterations = 10;
  }

  private init() {
    this.map.init().then(() => {
      this.player = new Player(this);
      this.waffle = new Waffle(this);
      this.initTimer();
      this.initMonsters();
      this.initialized = true;
      this._onInitialized();
    });
  }

  private initMonsters() {
    const m1 = new Monster(
      this,
      [
        new THREE.Vector3(5, 5, 4),
        new THREE.Vector3(5, 3, 4),
        new THREE.Vector3(5, 3, 0),
        new THREE.Vector3(5, 5, 0),
        new THREE.Vector3(5, 5, 4),
      ],
      true,
      false,
    );
    this.monsters.push(m1);

    const m2 = new Monster(
      this,
      [
        new THREE.Vector3(5, 3, 0),
        new THREE.Vector3(5, 1, 0),
        new THREE.Vector3(5, 1, -1),
        new THREE.Vector3(5, 3, -1),
        new THREE.Vector3(5, 3, -2),
        new THREE.Vector3(5, 1, -2),
        new THREE.Vector3(5, 1, -3),
        new THREE.Vector3(5, 3, -3),
        new THREE.Vector3(5, 3, -4),
        new THREE.Vector3(5, 1, -4),
      ],
      true,
      true,
    );
    this.monsters.push(m2);

    this.cannonTimeline.to({}, {duration: 1.5, repeat: -1, onRepeat: () => {
      const cannonBall = new Monster(
        this,
        [new THREE.Vector3(-2, -3, 5), new THREE.Vector3(5, -3, 5)],
        false,
        false,
        GSAP.Power0.easeNone,
      );
      this.monsters.push(cannonBall);
      cannonBall.timeline.eventCallback('onComplete', () => {
        cannonBall.dispose();
        this.monsters.splice(this.monsters.indexOf(cannonBall), 1);
      });
    }})

    const m3 = new Monster(
      this,
      [
        new THREE.Vector3(-5, 5, -4),
        new THREE.Vector3(-5, 5, -2),
        new THREE.Vector3(-5, 4, -2),
        new THREE.Vector3(-5, 4, -1),
        new THREE.Vector3(-5, 2, -1),
        new THREE.Vector3(-5, 2, -4),
        new THREE.Vector3(-5, 5, -4),
      ],
      true,
      false,
    );
    this.monsters.push(m3);

    const m4 = new Monster(
      this,
      [
        new THREE.Vector3(-5, 4, 1),
        new THREE.Vector3(-5, 4, 3),
        new THREE.Vector3(-5, 1, 3),
        new THREE.Vector3(-5, 1, 1),
        new THREE.Vector3(-5, 4, 1),
      ],
      true,
      false,
    );
    this.monsters.push(m4);
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
    this.player?.dispose();
    this.timer?.dispose();
    this.monsters.forEach((m) => m.dispose());
  }

  public animate(timeDelta: number) {
    this.cannonWorld.step(1 / 60, timeDelta);
    this.player?.animate(timeDelta);
    this.waffle?.animate(timeDelta);
    this.timer?.animate(timeDelta);
    this.monsters.forEach((m) => m.animate(timeDelta));
  }

  public pause() {
    this.player?.pause();
    this.monsters.forEach((m) => m.pause());
    this.cannonTimeline.pause();
  }

  public resume() {
    this.player?.resume();
    this.monsters.forEach((m) => m.resume());
    this.cannonTimeline.play();
  }

  public restart() {
    this.map.restart();
    this.player?.restart();
  }
}
