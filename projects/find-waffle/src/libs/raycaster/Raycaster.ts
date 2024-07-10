import * as THREE from 'three';

type MouseCoords = THREE.Vector2;
type EventType = 'mousemove' | 'click' | 'mousedown' | 'mouseup' | 'dblclick';
type EventCallbackMap = Map<
  EventType,
  { callback: EventCallback; targetObjects: THREE.Object3D[] }[]
>;
export type EventCallback = (
  intersects: THREE.Intersection[],
  mouseCoords?: THREE.Vector2,
) => void;

export class ListenableRaycaster extends THREE.Raycaster {
  camera: THREE.Camera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  mouseCoords: MouseCoords = new THREE.Vector2();
  selectedObject: THREE.Object3D | null = null;
  private eventCallbackMap: EventCallbackMap = new Map();
  private eventListeners: {
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

    this.eventListeners.mousemove = this.createEventHandler('mousemove');
    this.eventListeners.click = this.createEventHandler('click');
    this.eventListeners.mousedown = this.createEventHandler('mousedown');
    this.eventListeners.mouseup = this.createEventHandler('mouseup');
    this.eventListeners.dblclick = this.createEventHandler('dblclick');

    window.addEventListener('mousemove', this.eventListeners.mousemove);
    window.addEventListener('click', this.eventListeners.click);
    window.addEventListener('mousedown', this.eventListeners.mousedown);
    window.addEventListener('mouseup', this.eventListeners.mouseup);
    window.addEventListener('dblclick', this.eventListeners.dblclick);
  }

  // 공통 동작: 마우스 좌표값 업데이트, 레이캐스팅 통해 교차점 찾기
  private getIntersects(
    event: MouseEvent,
    targetObjects: THREE.Object3D[],
  ): THREE.Intersection[] {
    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    this.mouseCoords.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseCoords.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.setFromCamera(this.mouseCoords, this.camera);
    const intersects = this.intersectObjects(targetObjects, true);
    this.selectedObject = intersects.length > 0 ? intersects[0].object : null;
    return intersects;
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
  private createEventHandler(eventType: EventType) {
    return (event: MouseEvent) => {
      const callbackEntries = this.eventCallbackMap.get(eventType);
      if (callbackEntries) {
        for (const entry of callbackEntries) {
          const intersects = this.getIntersects(event, entry.targetObjects);
          entry.callback.length == 2
            ? entry.callback(intersects, this.mouseCoords)
            : entry.callback(intersects);
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
