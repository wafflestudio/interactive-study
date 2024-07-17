import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export const animateCharacter = (
  target: THREE.Object3D,
  body: CANNON.Body,
  keysPressed: Map<string, boolean>,
) => {
  let newDirection: number | null = null;
  if (keysPressed.has('up')) {
    target.position.z -= 0.1;
    body.position.z -= 0.1;
    newDirection = Math.PI;
  }

  if (newDirection !== null) {
    const targetQuaternion = new THREE.Quaternion();
    targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), newDirection);
    target.quaternion.slerp(targetQuaternion, 0.5); // 회전 속도 조절
  }
};
