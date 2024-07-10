import * as THREE from 'three';

type FoxModel = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

type Animation = {
  mixer: THREE.AnimationMixer;
  actions: Record<string, THREE.AnimationAction>;
  play: (name: string) => void;
};

type KeysPressed = Record<string, boolean>;

const animation: Animation = {
  mixer: null as any,
  actions: null as any,
  play: (name: string) => {},
};

// Fox의 애니메이션 설정(idle, walking, running)
const setFoxWalk = (foxModel: FoxModel) => {
  animation.mixer = new THREE.AnimationMixer(foxModel.scene);
  animation.actions = {};

  animation.actions.idle = animation.mixer.clipAction(foxModel.animations[0]);
  animation.actions.walking = animation.mixer.clipAction(
    foxModel.animations[1],
  );
  animation.actions.running = animation.mixer.clipAction(
    foxModel.animations[2],
  );

  animation.actions.current = animation.actions.idle;
  animation.actions.current.play();

  animation.play = (name) => {
    const newAction = animation.actions[name];
    const oldAction = animation.actions.current;

    newAction.reset();
    newAction.play();
    newAction.crossFadeFrom(oldAction, 0.5, true);

    animation.actions.current = newAction;
  };
};

// 키보드 이벤트에 따라 애니메이션 업데이트
const updateAnimation = (foxModel: FoxModel, keysPressed: KeysPressed) => {
  let moving = false;
  let newDirection = null;

  if (keysPressed['ArrowUp'] && keysPressed['ArrowLeft']) {
    foxModel.scene.position.z -= 0.1 * Math.SQRT1_2;
    foxModel.scene.position.x -= 0.1 * Math.SQRT1_2;
    newDirection = (-Math.PI * 3) / 4;
    moving = true;
  } else if (keysPressed['ArrowUp'] && keysPressed['ArrowRight']) {
    foxModel.scene.position.z -= 0.1 * Math.SQRT1_2;
    foxModel.scene.position.x += 0.1 * Math.SQRT1_2;
    newDirection = (Math.PI * 3) / 4;
    moving = true;
  } else if (keysPressed['ArrowDown'] && keysPressed['ArrowLeft']) {
    foxModel.scene.position.z += 0.1 * Math.SQRT1_2;
    foxModel.scene.position.x -= 0.1 * Math.SQRT1_2;
    newDirection = -Math.PI / 4;
    moving = true;
  } else if (keysPressed['ArrowDown'] && keysPressed['ArrowRight']) {
    foxModel.scene.position.z += 0.1 * Math.SQRT1_2;
    foxModel.scene.position.x += 0.1 * Math.SQRT1_2;
    newDirection = Math.PI / 4;
    moving = true;
  } else {
    if (keysPressed['ArrowUp']) {
      foxModel.scene.position.z -= 0.1;
      newDirection = Math.PI;
      moving = true;
    }
    if (keysPressed['ArrowDown']) {
      foxModel.scene.position.z += 0.1;
      newDirection = 0;
      moving = true;
    }
    if (keysPressed['ArrowLeft']) {
      foxModel.scene.position.x -= 0.1;
      newDirection = -Math.PI / 2;
      moving = true;
    }
    if (keysPressed['ArrowRight']) {
      foxModel.scene.position.x += 0.1;
      newDirection = Math.PI / 2;
      moving = true;
    }
  }

  if (newDirection !== null) {
    const targetQuaternion = new THREE.Quaternion();
    targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), newDirection);
    foxModel.scene.quaternion.slerp(targetQuaternion, 0.5); // 0.1은 회전 속도를 조절하는 값입니다.
  }

  if (moving && animation.actions.current !== animation.actions.walking) {
    animation.play('walking');
  } else if (!moving && animation.actions.current !== animation.actions.idle) {
    animation.play('idle');
  }
};

export { setFoxWalk, animation, updateAnimation };
