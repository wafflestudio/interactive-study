import * as THREE from 'three';

type MouseCoords = THREE.Vector2;
export type EventCallback = (intersects: THREE.Intersection[]) => void;
interface EventCallbacks {
  mousemove?: EventCallback[];
  click?: EventCallback[];
  mousedown?: EventCallback[];
  mouseup?: EventCallback[];
  dblclick?: EventCallback[];
}

export class Raycaster extends THREE.Raycaster {
  camera: THREE.Camera;
  scene: THREE.Scene;
  mouseCoords: MouseCoords = new THREE.Vector2();
  dragging: boolean = false;
  selectedObject: THREE.Object3D | null = null;
  offset: THREE.Vector3 = new THREE.Vector3();
  callbacks: EventCallbacks = {};

  constructor(camera: THREE.Camera, scene: THREE.Scene) {
    super();
    this.camera = camera;
    this.scene = scene;

    window.addEventListener('mousemove', this.handleEvent('mousemove'));
    window.addEventListener('click', this.handleEvent('click'));
    window.addEventListener('mousedown', this.handleEvent('mousedown'));
    window.addEventListener('mouseup', this.handleEvent('mouseup'));
    window.addEventListener('dblclick', this.handleEvent('dblclick'));
  }

  // 공통 동작: 마우스 좌표값 업데이트, 레이캐스팅 통해 교차점 찾기
  getIntersects(event: MouseEvent): THREE.Intersection[] {
    this.mouseCoords.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseCoords.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.setFromCamera(this.mouseCoords, this.camera);
    return this.intersectObjects(this.scene.children);
  }

  // 이벤트 핸들러에 콜백 등록
  registerCallback(eventType: keyof EventCallbacks, callback: EventCallback) {
    if (!this.callbacks[eventType]) {
      this.callbacks[eventType] = [];
    }
    this.callbacks[eventType]!.push(callback);
  }

  // 이벤트 핸들러 설정
  handleEvent(eventType: keyof EventCallbacks) {
    return (event: MouseEvent) => {
      const callbacksForEvent = this.callbacks[eventType];
      const intersects = this.getIntersects(event);
      if (callbacksForEvent) {
        for (const callback of callbacksForEvent) {
          callback(intersects);
        }
      }
    };
  }

  // raycaster.dispose() 호출 시 이벤트 리스너 제거
  dispose() {
    window.removeEventListener('mousemove', this.handleEvent('mousemove'));
    window.removeEventListener('click', this.handleEvent('click'));
    window.removeEventListener('mousedown', this.handleEvent('mousedown'));
    window.removeEventListener('mouseup', this.handleEvent('mouseup'));
    window.removeEventListener('dblclick', this.handleEvent('dblclick'));
  }
}
