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
