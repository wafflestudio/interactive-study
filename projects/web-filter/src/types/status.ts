export enum STATUS {
  INACTIVE = 'INACTIVE', // 선택기가 비활성화된 상태
  SURFING = 'SURFING', // 마우스가 움직이면서 요소를 탐색 중인 상태
  SELECTED = 'SELECTED', // 요소가 선택된 상태
}

export enum ACTION {
  START_SELECT_ELEMENT = 'START_SELECT_ELEMENT',
  APPLY_FILTER = 'APPLY_FILTER',
}
