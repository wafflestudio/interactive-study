import { random, throttle } from 'es-toolkit';
import * as THREE from 'three';

import { StageManager } from '../../core/stage/StageManager';
import {
  GOOSE_QUIZ_ANGLE,
  MAX_GOOSE_NUM,
  PASSWORD_QUIZ_ANGLE,
} from './constant';
import { Goose } from './object/goose/Goose';
import { GooseCircularAnimator } from './object/goose/animator';
import { GooseIcon } from './object/icon/Icon';
import { GooseWaffleIcon } from './object/icon/WaffleIcon';
import { StaticGooseStage } from './staticStage';
import { GOOSE_LOVE, WAFFLE_KEY } from './util/loader';
import { traverseAncestor } from './util/object';

/** 이벤트를 스스로/객체에 전달해 처리합니다. */
export class GooseStage extends StaticGooseStage {
  #draggingIcon?: GooseIcon;
  #waffleIcon?: GooseWaffleIcon;
  #stageCleared = false;

  constructor(renderer: THREE.WebGLRenderer, app: HTMLElement) {
    super(renderer, app);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onHillMouseMove = this.onHillMouseMove.bind(this);
    this.onHillMouseUp = this.onHillMouseUp.bind(this);
    this.onIconMouseMove = this.onIconMouseMove.bind(this);
    this.onIconMouseUp = this.onIconMouseUp.bind(this);
    this.addGoose = throttle(this.addGoose.bind(this), 1000);
  }

  mount() {
    super.mount();
    this.#stageCleared = false;
  }

  get hoverableObjects() {
    return [
      this.mixIcon,
      this.makerIcon,
      this.#waffleIcon,
      this.gooseIcon,
      this.mirrorIcon,
      ...this.gooseList,
      this.folderIcon,
      this.memoIcon,
    ].filter((x) => x !== undefined);
  }

  get clickableObjects() {
    return [
      this.hill,
      this.mixIcon,
      this.makerIcon,
      this.#waffleIcon,
      this.gooseIcon,
      this.mirrorIcon,
      ...this.gooseList,
      this.folderIcon,
      this.memoIcon,
    ].filter((x) => x !== undefined);
  }

  get windowObjects() {
    return [this.window1, this.window2].filter((x) => x !== undefined);
  }

  unmount() {
    removeEventListener('mousedown', this.onMouseDown);
    removeEventListener('mousemove', this.onHillMouseMove);
    removeEventListener('mouseup', this.onHillMouseUp);
    removeEventListener('mousemove', this.onIconMouseMove);
    removeEventListener('mouseup', this.onIconMouseUp);
    super.unmount();
  }

  animate(time: DOMHighResTimeStamp) {
    super.animate(time);
    const isHovering = this.raycaster.firstIntersect(this.hoverableObjects);
    document.body.style.cursor = isHovering ? 'pointer' : 'auto';
  }

  mountStaticObjs() {
    super.mountStaticObjs();
    if (this.camera) {
      // this.camera.maxAngle = Math.PI * 2;
      this.camera.maxAngle = GOOSE_QUIZ_ANGLE;
      this.setStartButtonText('Start');
    }
    this.gooseQuizWindow?.addSolvedListener(() => {
      this.camera!.maxAngle = PASSWORD_QUIZ_ANGLE;
    });
    this.passwordQuizWindow?.addSolvedListener(() => {
      this.camera!.maxAngle = Math.PI * 2;
    });
  }

  mountExternalObjs() {
    super.mountExternalObjs();
    addEventListener('mousedown', this.onMouseDown);
    if (this.gooseIcon) {
      this.gooseIcon.addGoose = this.addGoose;
    }
  }

  // event handling
  onMouseDown() {
    const intersection = this.raycaster.firstIntersect(this.clickableObjects);
    if (intersection === null) return;

    traverseAncestor(intersection.object, (object) => {
      if (object === this.hill) {
        this.onHillMouseDown();
        return true;
      } else if (object instanceof GooseIcon) {
        this.onIconMouseDown(object);
        return true;
      } else if (object instanceof Goose) {
        object.onMouseDown();
        this.gooseQuizWindow?.gooseClicked(object.id);
        return true;
      } else {
        return false;
      }
    });
  }

  // Hill events
  onHillMouseDown() {
    addEventListener('mousemove', this.onHillMouseMove);
    addEventListener('mouseup', this.onHillMouseUp);
  }

  onHillMouseMove(e: MouseEvent) {
    this.camera?.onMouseMove(e);
  }

  onHillMouseUp() {
    this.camera?.onMouseUp();
    removeEventListener('mousemove', this.onHillMouseMove);
    removeEventListener('mouseup', this.onHillMouseUp);
  }

  // Icon event
  onIconMouseDown(icon: GooseIcon) {
    this.#draggingIcon = icon;
    icon.onMouseDown();

    if (icon === this.#waffleIcon) {
      if (this.#stageCleared) return;
      this.#stageCleared = true;

      const message = 'Stage Clear!';
      let idx = 0;
      const id = setInterval(() => {
        if (message.length < idx) {
          clearInterval(id);
          setTimeout(() => {
            StageManager.instance.toHome();
          }, 2000);
        } else {
          this.setStartButtonText(message.slice(0, idx));
        }
        idx++;
      }, 150);
    } else {
      // 와플을 클릭한 경우 unmount되므로 아래 작업 필요 없음
      addEventListener('mousemove', this.onIconMouseMove);
      addEventListener('mouseup', this.onIconMouseUp);
    }
  }

  onIconMouseMove(e: MouseEvent) {
    const intersection = this.raycaster.firstIntersect(this.windowObjects);
    if (intersection === null) return;
    this.#draggingIcon?.onMouseMove(intersection.point, e);
  }

  onIconMouseUp() {
    this.#draggingIcon?.onMouseUp();

    // 와플이 생겨야하는 경우 처리
    if (this.#isMixOnMaker()) {
      this.#waffleIcon = new GooseWaffleIcon(
        this.loader?.getModelObject(WAFFLE_KEY)!,
      );
      this.scene?.add(this.#waffleIcon);
      this.window2?.registerIcon(this.#waffleIcon);

      this.mixIcon?.removeFromParent();
      this.makerIcon?.shrink();
    }

    this.#draggingIcon = undefined;
    removeEventListener('mousemove', this.onIconMouseMove);
    removeEventListener('mouseup', this.onIconMouseUp);
  }

  // Actions
  #isMixOnMaker() {
    const mouseOnMix = this.raycaster.firstIntersect(this.mixIcon!) !== null;
    const mouseOnMaker =
      this.raycaster.firstIntersect(this.makerIcon!) !== null;
    const draggingMix = this.#draggingIcon === this.mixIcon;
    const mixRotated = this.mixIcon?.status === 'drag';

    return mouseOnMix && mouseOnMaker && draggingMix && mixRotated;
  }

  addGoose() {
    if (!this.hill || MAX_GOOSE_NUM <= this.gooseList.length) return;

    const goose = new Goose(
      this.loader!.loadGooseTextures(),
      this.loader?.getTexture(GOOSE_LOVE)!,
      new GooseCircularAnimator(this.hill, random(30, 50), -20),
    );

    this.gooseList.push(goose);
    this.scene?.add(goose);
  }
}
