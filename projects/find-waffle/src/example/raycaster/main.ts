import * as THREE from 'three';

import { EventCallback, Raycaster } from '../../libs/raycaster/Raycaster.ts';

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
const raycaster = new Raycaster(camera, scene);

// 마우스가 오브젝트 위에 있을 때 색상 변경 예제
const mouseMoveCallback: EventCallback = (intersects: THREE.Intersection[]) => {
  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;

    if (raycaster.selectedObject !== intersectedObject) {
      if (raycaster.selectedObject) {
        raycaster.selectedObject.material.color.set('#00ff00');
      }
      raycaster.selectedObject = intersectedObject;
      raycaster.selectedObject.material.color.set('#ff0000');
    }
  } else {
    if (raycaster.selectedObject) {
      raycaster.selectedObject.material.color.set('#00ff00');
      raycaster.selectedObject = null;
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
  if (raycaster.dragging && raycaster.selectedObject) {
    if (intersects.length > 0) {
      const intersect = intersects[0];
      const newPosition = new THREE.Vector3()
        .copy(intersect.point)
        .add(raycaster.offset);
      newPosition.z = raycaster.selectedObject.position.z; // z좌표 고정하고 x, y축으로만 drag -> customizing이 필요할 것
      raycaster.selectedObject.position.copy(newPosition);
    }
  }
};

const mouseDownCallback: EventCallback = (intersects: THREE.Intersection[]) => {
  if (intersects.length > 0) {
    raycaster.dragging = true;
    raycaster.selectedObject = intersects[0].object;
    raycaster.offset
      .copy(raycaster.selectedObject.position)
      .sub(intersects[0].point);
  }
};

const mouseUpCallback: EventCallback = () => {
  raycaster.dragging = false;
  raycaster.selectedObject = null;
};

raycaster.registerCallback('mousemove', mouseMoveCallback);
raycaster.registerCallback('mousemove', mouseMoveCallbackForDrag);
raycaster.registerCallback('click', clickCallback);
raycaster.registerCallback('mousedown', mouseDownCallback);
raycaster.registerCallback('mouseup', mouseUpCallback);

raycaster.dispose();
