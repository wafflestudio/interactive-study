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
 * Material 에 테두리를 추가합니다.
 * @param material 테두리를 추가할 Material
 * @param color 테두리 색상
 * @param width 테두리 두께
 * @returns 테두리가 추가된 Material
 */
export function addBorderToMaterial(
  material: THREE.Material,
  color: THREE.ColorRepresentation,
  width: number,
): THREE.Material {
  if (material.defines === undefined) material.defines = {};
  material.defines.USE_UV = '';
  material.onBeforeCompile = (shader) => {
    shader.uniforms.size = { value: new THREE.Vector2(1, 1) };
    shader.uniforms.borderWidth = { value: width };
    shader.uniforms.borderColor = { value: new THREE.Color(color) };
    shader.fragmentShader = `
    uniform vec2 size;
    uniform float borderWidth;
    uniform vec3 borderColor;
    ${shader.fragmentShader}
  `.replace(
      '#include <color_fragment>',
      `
  #include <color_fragment>
  vec3 col = diffuseColor.rgb;
  vec2 s = (size * 0.5) - borderWidth;
  
  vec2 ruv = abs((vUv - 0.5) * size);
  vec2 fe = fwidth(ruv);
  float e = min(fe.x, fe.y) * 0.5;
  float border = smoothstep(s.x + e, s.x - e, ruv.x) * smoothstep(s.y + e, s.y - e, ruv.y);
  diffuseColor.rgb = mix(borderColor, col, clamp(border, 0., 1.));   
    `,
    );
  };
  return material;
}
