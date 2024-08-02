import * as THREE from 'three';

export class GooseLight extends THREE.Group {
  constructor() {
    super();

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2.5);
    this.add(hemisphereLight);

    const sunlight = new THREE.DirectionalLight('white', 1);
    sunlight.position.set(100, 10, 0);
    sunlight.lookAt(0, 10, 0);
    sunlight.castShadow = true;
    this.add(sunlight);

    const cloudHeight = 30;
    const hillSize = 53;
    let cloudLight = new THREE.RectAreaLight(0xffffff, 5, 120, 30);
    cloudLight.position.set(hillSize, cloudHeight, 0);
    cloudLight.lookAt(hillSize + 1, cloudHeight, 0);
    this.add(cloudLight);

    cloudLight = cloudLight.clone();
    cloudLight.position.set(-hillSize, cloudHeight, 0);
    cloudLight.lookAt(-hillSize - 1, cloudHeight, 0);
    this.add(cloudLight);

    cloudLight = cloudLight.clone();
    cloudLight.position.set(0, cloudHeight, hillSize);
    cloudLight.lookAt(0, cloudHeight, hillSize + 1);
    this.add(cloudLight);

    cloudLight = cloudLight.clone();
    cloudLight.position.set(0, cloudHeight, -hillSize);
    cloudLight.lookAt(0, cloudHeight, -hillSize - 1);
    this.add(cloudLight);
  }
}
