import * as CANNON from 'cannon-es';

export const animateCharacter = (
  // target: THREE.Object3D,
  body: CANNON.Body,
  keysPressed: Map<string, boolean>,
) => {
  let newDirection: number | null = null;
  if (keysPressed.has('up')) {
    body.position.z -= 0.1;
    newDirection = Math.PI;
  }

  if (newDirection !== null) {
    const bodyQuaternion = new CANNON.Quaternion();
    bodyQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), newDirection);
    body.quaternion = body.quaternion.slerp(bodyQuaternion, 0.5); // 회전 속도 조절
  }
};
