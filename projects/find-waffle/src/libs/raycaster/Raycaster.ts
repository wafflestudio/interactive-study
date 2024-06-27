import * as THREE from 'three';

type MouseCoords = THREE.Vector2;
export type EventCallback = (
  event: MouseEvent,
  intersects: THREE.Intersection[],
) => void;

export class Raycaster extends THREE.Raycaster {
  camera: THREE.Camera;
  scene: THREE.Scene;
  mouseCoords: MouseCoords = new THREE.Vector2();
  dragging: boolean = false;
  selectedObject: THREE.Object3D | null = null;
  offset: THREE.Vector3 = new THREE.Vector3();
  onMouseMoveCallback?: EventCallback;
  onClickCallback?: EventCallback;
  onMouseDownCallback?: EventCallback;
  onMouseUpCallback?: EventCallback;
  onDblClickCallback?: EventCallback;

  constructor(camera: THREE.Camera, scene: THREE.Scene) {
    super();
    this.camera = camera;
    this.scene = scene;
  }

  // 기본 동작: 마우스 좌표값 업데이트, 레이캐스팅 통해 교차점 찾기
  updateMouseCoords(event: MouseEvent) {
    this.mouseCoords.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseCoords.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  getIntersects(event: MouseEvent): THREE.Intersection[] {
    this.updateMouseCoords(event);
    this.setFromCamera(this.mouseCoords, this.camera);
    return this.intersectObjects(this.scene.children);
  }

  // 이벤트 핸들러에 콜백 등록
  setMouseMoveHandler(mouseMoveCallback: EventCallback) {
    this.onMouseMoveCallback = mouseMoveCallback;
  }

  setClickHandler(clickCallback: EventCallback) {
    this.onClickCallback = clickCallback;
  }

  setMouseDownHandler(mouseDownCallback: EventCallback) {
    this.onMouseDownCallback = mouseDownCallback;
  }

  setMouseUpHandler(mouseUpCallback: EventCallback) {
    this.onMouseUpCallback = mouseUpCallback;
  }

  setDblClickHandler(dblClickCallback: EventCallback) {
    this.onDblClickCallback = dblClickCallback;
  }

  // 이벤트 핸들러 설정
  handleEvent(event: MouseEvent, callback?: EventCallback) {
    if (callback) {
      const intersects = this.getIntersects(event);
      callback(event, intersects);
    }
  }

  onMouseMove(event: MouseEvent) {
    this.handleEvent(event, this.onMouseMoveCallback);
  }

  onClick(event: MouseEvent) {
    this.handleEvent(event, this.onClickCallback);
  }

  onMouseDown(event: MouseEvent) {
    this.handleEvent(event, this.onMouseDownCallback);
  }

  onMouseUp(event: MouseEvent) {
    this.handleEvent(event, this.onMouseUpCallback);
  }

  onDblClick(event: MouseEvent) {
    this.handleEvent(event, this.onDblClickCallback);
  }
}
