import * as THREE from 'three';

/**
 * 주어진 너비와 높이에 맞게 캔버스를 리사이즈하고 카메라의 비율을 조정합니다.
 *
 * @param renderer
 * @param camera
 * @param width
 * @param height
 */
export function resize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.Camera,
  width: number,
  height: number,
): void {
  renderer.setSize(width, height);
  const aspect = width / height;
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  } else if (camera instanceof THREE.OrthographicCamera) {
    camera.left = camera.bottom * aspect;
    camera.right = camera.top * aspect;
    camera.updateProjectionMatrix();
  }
}

/**
 * Pivot object on world axis.
 * @param object 회전하려는 객체
 * @param center 회전 축이 지나는 점
 * @param axis 회전 축 (world)
 * @param angle 회전 각도 (degree)
 * @see {@link pivotOnAxis}
 */
export function pivotOnWorldAxis(
  object: THREE.Object3D,
  center: THREE.Vector3,
  axis: THREE.Vector3,
  angle: number,
): void {
  const parent = object.parent;

  if (parent === null) {
    console.error("object can't be found in the world");
  } else {
    const radianAngle = THREE.MathUtils.degToRad(angle);

    // rotate object on world axis
    object.rotateOnWorldAxis(axis, radianAngle);

    // rotate object position around center
    parent.worldToLocal(
      parent
        .localToWorld(object.position)
        .sub(center)
        .applyAxisAngle(axis, radianAngle)
        .add(center),
    );
  }
}

/**
 * Pivot object on axis.
 * @param object 회전하려는 객체
 * @param center 회전 축이 지나는 점
 * @param axis  회전 축 (local)
 * @param angle 회전 각도 (degree)
 */
export function pivotOnParentAxis(
  object: THREE.Object3D,
  center: THREE.Vector3,
  axis: THREE.Vector3,
  angle: number,
): void {
  const parent = object.parent;

  if (parent === null) {
    console.error('object does not have parent');
  } else {
    parent.localToWorld(center);
    axis.applyQuaternion(parent.getWorldQuaternion(new THREE.Quaternion()));
    pivotOnWorldAxis(object, center, axis, angle);
  }
}
