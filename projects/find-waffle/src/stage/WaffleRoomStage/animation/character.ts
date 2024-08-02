import * as CANNON from 'cannon-es';
import * as THREE from 'three';

let prevTime: number | undefined = undefined;

export const animateCharacter = (
  d: number,
  body: CANNON.Body,
  keysPressed: Map<string, boolean>,
) => {
  let newDirection: number | null = null;
  let speed = d * 10;

  if (keysPressed.has('up')) {
    body.position.z -= speed;
    newDirection = Math.PI;
  }
  if (keysPressed.has('down')) {
    body.position.z += speed;
    newDirection = 0;
  }
  if (keysPressed.has('left')) {
    body.position.x -= speed;
    newDirection = -Math.PI / 2;
  }
  if (keysPressed.has('right')) {
    body.position.x += speed;
    newDirection = Math.PI / 2;
  }

  if (newDirection !== null) {
    const bodyQuaternion = new CANNON.Quaternion();
    bodyQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), newDirection);
    body.quaternion = body.quaternion.slerp(bodyQuaternion, 0.5); // 회전 속도 조절
  }
};
