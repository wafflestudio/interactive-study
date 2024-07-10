import * as THREE from 'three';

const sunLight = new THREE.DirectionalLight('#ffffff', 4);

sunLight.castShadow = true;
sunLight.shadow.camera.far = 15;
sunLight.shadow.mapSize.set(1024, 1024);
sunLight.shadow.normalBias = 0.05;
sunLight.position.set(3, 3, -2.25);

export { sunLight };
