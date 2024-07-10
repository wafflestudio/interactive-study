import * as THREE from 'three';

type MouseCoords = THREE.Vector2;
type EventType = 'mousemove' | 'click' | 'mousedown' | 'mouseup' | 'dblclick';
type EventCallbackMap = Map<
  EventType,
  { callback: EventCallback; targetObjects: THREE.Object3D[] }[]
>;
export type EventCallback = (intersects: THREE.Intersection[]) => void;

export class Raycaster extends THREE.Raycaster {
  camera: THREE.Camera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  mouseCoords: MouseCoords = new THREE.Vector2();
  dragging: boolean = false;
  selectedObject: THREE.Object3D | null = null;
  offset: THREE.Vector3 = new THREE.Vector3();
  eventCallbackMap: EventCallbackMap = new Map();
  eventListeners: {
    [key in EventType]?: (event: MouseEvent) => void;
  } = {};

  constructor(
    camera: THREE.Camera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
  ) {
    super();
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;

    this.eventCallbackMap = new Map([
      ['mousemove', []],
      ['click', []],
      ['mousedown', []],
      ['mouseup', []],
      ['dblclick', []],
    ]);

    this.eventListeners.mousemove = this.handleEvent('mousemove');
    this.eventListeners.click = this.handleEvent('click');
    this.eventListeners.mousedown = this.handleEvent('mousedown');
    this.eventListeners.mouseup = this.handleEvent('mouseup');
    this.eventListeners.dblclick = this.handleEvent('dblclick');

    window.addEventListener('mousemove', this.eventListeners.mousemove);
    window.addEventListener('click', this.eventListeners.click);
    window.addEventListener('mousedown', this.eventListeners.mousedown);
    window.addEventListener('mouseup', this.eventListeners.mouseup);
    window.addEventListener('dblclick', this.eventListeners.dblclick);
  }

  // 공통 동작: 마우스 좌표값 업데이트, 레이캐스팅 통해 교차점 찾기
  getIntersects(
    event: MouseEvent,
    targetObjects: THREE.Object3D[],
  ): THREE.Intersection[] {
    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    this.mouseCoords.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseCoords.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.setFromCamera(this.mouseCoords, this.camera);
    return this.intersectObjects(targetObjects, true);
  }

  // 이벤트 핸들러에 콜백 등록
  registerCallback(
    eventType: EventType,
    callback: EventCallback,
    targetObjects: THREE.Object3D[],
  ) {
    this.eventCallbackMap.get(eventType)!.push({ callback, targetObjects });
  }

  // 이벤트 핸들러 설정
  handleEvent(eventType: EventType) {
    return (event: MouseEvent) => {
      const callbackEntries = this.eventCallbackMap.get(eventType);
      if (callbackEntries) {
        for (const entry of callbackEntries) {
          const intersects = this.getIntersects(event, entry.targetObjects);
          entry.callback(intersects);
        }
      }
    };
  }

  // raycaster.dispose() 호출 시 이벤트 리스너 제거
  dispose() {
    this.eventCallbackMap.clear();
    if (this.eventListeners.mousemove) {
      window.removeEventListener('mousemove', this.eventListeners.mousemove);
    }
    if (this.eventListeners.click) {
      window.removeEventListener('click', this.eventListeners.click);
    }
    if (this.eventListeners.mousedown) {
      window.removeEventListener('mousedown', this.eventListeners.mousedown);
    }
    if (this.eventListeners.mouseup) {
      window.removeEventListener('mouseup', this.eventListeners.mouseup);
    }
    if (this.eventListeners.dblclick) {
      window.removeEventListener('dblclick', this.eventListeners.dblclick);
    }
  }
}
