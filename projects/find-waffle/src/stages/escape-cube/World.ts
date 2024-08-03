import * as CANNON from 'cannon-es';
import { noop } from 'es-toolkit';
import gsap, * as GSAP from 'gsap';
import * as THREE from 'three';

import { StageManager } from '../../core/stage/StageManager';
import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';
import { resize } from '../../utils';
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
  private _followingCamera = false;
  private originalCameraPosition: [number, number];
  private originalCameraTop: number;
  monsters: Monster[] = [];
  cannonTimeline = gsap.timeline();
  _onInitialized: () => void = noop;

  get followingCamera() {
    return this._followingCamera;
  }

  set followingCamera(value: boolean) {
    this._followingCamera = value;
    if (value) {
      gsap
        .timeline()
        .to(
          this.camera.position,
          {
            x: this.player!.position.x,
            y: this.player!.position.y,
            duration: 1,
          },
          'start',
        )
        .to(
          this.camera,
          {
            top: 3,
            bottom: -3,
            duration: 1,
            onUpdate: () => {
              resize(
                StageManager.instance.renderer,
                this.camera,
                window.innerWidth,
                window.innerHeight,
              );
            },
          },
          'start',
        );
    } else {
      this.camera.position.x = this.originalCameraPosition[0];
      this.camera.position.y = this.originalCameraPosition[1];
      this.camera.top = this.originalCameraTop;
      this.camera.bottom = -this.originalCameraTop;
      resize(
        StageManager.instance.renderer,
        this.camera,
        window.innerWidth,
        window.innerHeight,
      );
    }
  }

  set onInitialized(value: () => void) {
    this._onInitialized = value;
    if (this.initialized) {
      this._onInitialized();
    }
  }

  constructor(
    public scene: THREE.Scene,
    public camera: THREE.OrthographicCamera,
  ) {
    this.originalCameraPosition = [camera.position.x, camera.position.y];
    this.originalCameraTop = camera.top;
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

    this.cannonTimeline.to(
      {},
      {
        duration: 2,
        repeat: -1,
        onRepeat: () => {
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
        },
      },
    );

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
    if (this.followingCamera) {
      this.camera.position.x = this.player!.position.x;
      this.camera.position.y = this.player!.position.y;
    }
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
