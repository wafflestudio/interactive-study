# React Leon Sans

## To-Do

- 수요일까지 Example 사이트 1개 ~ 2개를 작업!

## 작업 진행 상황 (~11.27)

**디렉토리**

- components: 라이브러리에서 제공할 컴포넌트들
- hooks: 라이브러리에서 제공할 hook들
- examples: components와 hooks를 이용해서 App.tsx에서 확인할 예시를 구현한 컴포넌트
- types: 기본 leon-sans에 포함되지 않는, leon-sans-react의 타입들만을 정의

**작업한 것**

1. LeonCanvas, LeonPixi 만듦
2. Example 간단히 만듦(캔버스는 글자 써지기와 웨이브, Pixi는 글자 써지기만)
3. 애니메이팅을 위한 Dispatcher와 Handler의 기본 구조 만듦

**해야할 것**

1. **다양한 애니메이션 (특히 Pixi) 적용해보기**
2. **Leon에 타입 적용하기**
3. LeonCanvas와 LeonPixi의 Params 풍부하게 만들기
4. Dispatcher의 메소드 다양하게 만들기
5. Handler 다양하게 만들기
6. **글자 위치 변경 가능하게 바꾸기 (현재는 캔버스 가운데에 그려짐)**
7. **알 수 없는 에러들 해결 (맨 밑에 적어두었습니다)**

## dataRefs로 값을 관리

LeonCanvas 또는 LeonPixi는 `useRef`를 이용하여 데이터를 저장합니다. 관리의 편의성을 위해 하나의 ref에 모든 데이터를 저장하고 있습니다. 이 ref의 타입은 dataRefs에서 확인할 수 있습니다.
아래는 각각의 데이터가 의미하는 바입니다.

- leon: 생성된 Leon 인스턴스
- canvas: 캔버스 ref
- ctx, renderer, stage, graphic 등: canvas나 pixi에 글자를 그리고 애니메이팅을 할 수 있는 객체들
- isDraw: 캔버스에 글자를 그리는 기본 애니메이션을 사용할 지를 결정
- pixelRatio: 캔버스의 해상도를 결정하는 픽셀비

## 애니메이션 가이드

### 1. Dispatcher 사용하기

`useDispatcher` 또는 `usePixiDispatcher`를 쓰면 Leon을 컨트롤하는 객체를 얻을 수 있습니다. 이는 명령형으로 Leon을 애니메이팅 하는데 사용됩니다.
Dispatcher에는 상황에 맞게 쉽게 사용할 수 있는 몇 가지 메소드가 정의되어 있어야 하는데... 현재는 `send`밖에 없습니다.
send는 연결된 Leon의 dataRefs에 접근할 수 있는 콜백을 인자로 받으며, 콜되는 순간 애니메이션을 작동시킵니다. (ref로 뽑아오는 방식과 다를게 없습니다.)

### 2. handler 사용하기

handler는 LeonCanvas나 LeonPixi에 params로 전달되며, 선언형으로 Leon을 애니메이팅하는데 사용됩니다. `types/Handler.ts`에서 타입을 확인할 수 있습니다.
현재는 글자가 다시 그려지는 모든 animate loop마다 작동하는 `onAnimate` 핸들러만 제공하고 있습니다. 역시 다양해질 필요가 있겠죠...

## 글자 위치 변경에 관하여

기본적으로 글자의 위치는 params로 전달되면 좋을 것 같습니다. x와 y 그리고 pivot이 필요할 것 같습니다. x와 y는 캔버스 좌상단으로부터의 위치, 그리고 pivot `center`, `leftTop`, `rightBottom`처럼 (x,y)에 글자의 어느 점을 맞출 지 결정하는 값을 저장하면 좋을 거 같아요.
여기까지 생각은 했는데 구현은 아직 못했습니다ㅠㅠ

## 알 수 없는 에러

- wave가 처음에는 잘 적용되는데, 껐다 키면 절반밖에 적용이 안됩니다...!
- canvas에다가 getContext("2d")로 얻어낸 ctx 객체가 null일 수도 있더라구요... 왜일까요?
