import * as THREE from 'three';

import {
  EventCallback,
  ListenableRaycaster,
} from '../../libs/raycaster/Raycaster.ts';

/* Scene Settings */
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.margin = '0';
canvas.style.padding = '0';
document.body.appendChild(canvas);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BoxGeometry();
const material1 = new THREE.MeshBasicMaterial({ color: '#00ff00' });
const material2 = new THREE.MeshBasicMaterial({ color: '#00ff00' });
const material3 = new THREE.MeshBasicMaterial({ color: '#00ff00' });
const cube1 = new THREE.Mesh(geometry, material1);
const cube2 = new THREE.Mesh(geometry, material2);
const cube3 = new THREE.Mesh(geometry, material3);
cube1.position.x = -3;
cube2.position.x = 0;
cube3.position.x = 3;
scene.add(cube1);
scene.add(cube2);
scene.add(cube3);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  cube1.rotation.x += 0.01;
  cube1.rotation.y += 0.01;

  cube2.rotation.x += 0.01;
  cube2.rotation.y += 0.01;

  cube3.rotation.x += 0.01;
  cube3.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

/* Raycaster Settings */
const raycaster = new ListenableRaycaster(camera, scene, renderer);
const targetObjects: THREE.Object3D[] = [cube1, cube2, cube3];
let dragging = false;
let selectedObject: THREE.Object3D | null = null;
let offset = new THREE.Vector3();

// 마우스가 오브젝트 위에 있을 때 색상 변경 예제
const mouseMoveCallback: EventCallback = (intersects: THREE.Intersection[]) => {
  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;

    if (selectedObject !== intersectedObject) {
      if (selectedObject) {
        selectedObject.material.color.set('#00ff00');
      }
      selectedObject = intersectedObject;
      selectedObject.material.color.set('#ff0000');
    }
  } else {
    if (selectedObject) {
      selectedObject.material.color.set('#00ff00');
      selectedObject = null;
    }
  }
};

const clickCallback: EventCallback = (intersects: THREE.Intersection[]) => {
  if (intersects.length > 0) {
    console.log('Clicked', intersects[0].object);
  }
};

// 드래그를 위한 mousemove 이벤트 콜백
const mouseMoveCallbackForDrag: EventCallback = (
  intersects: THREE.Intersection[],
) => {
  if (dragging && selectedObject) {
    if (intersects.length > 0) {
      const intersect = intersects[0];
      const newPosition = new THREE.Vector3().copy(intersect.point).add(offset);
      newPosition.z = selectedObject.position.z; // z좌표 고정하고 x, y축으로만 drag -> customizing이 필요할 것
      selectedObject.position.copy(newPosition);
    }
  }
};

const mouseDownCallback: EventCallback = (intersects: THREE.Intersection[]) => {
  if (intersects.length > 0) {
    dragging = true;
    selectedObject = intersects[0].object;
    offset.copy(selectedObject.position).sub(intersects[0].point);
  }
};

const mouseUpCallback: EventCallback = () => {
  dragging = false;
  selectedObject = null;
};

raycaster.registerCallback('mousemove', mouseMoveCallback, targetObjects);
raycaster.registerCallback(
  'mousemove',
  mouseMoveCallbackForDrag,
  targetObjects,
);
raycaster.registerCallback('click', clickCallback, targetObjects);
raycaster.registerCallback('mousedown', mouseDownCallback, targetObjects);
raycaster.registerCallback('mouseup', mouseUpCallback, targetObjects);
