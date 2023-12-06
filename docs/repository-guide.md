# Repository Guide

interactive-study는 yarn workspaces를 이용한 모노레포 구조를 사용합니다.

## 새로운 프로젝트를 생성할 때는 이렇게!

### 1. 프로젝트 생성하기

`/projects` 또는 `/libs` 디렉토리 중 성격에 맞는 곳에 프로젝트명으로 하위 디렉토리를 만들고 작업을 시작해주세요.
작업은

### 2. 모노레포에 프로젝트 통합하기

`/projects` 또는 `/libs` 디렉토리 내부에 위치한 모든 `packages.json`은 자동으로 전체 레포의 하위 워크스페이스로 인식됩니다.
이 때, `package.json`에 명시된 `name`이 해당 워크스페이스의 이름이 되므로, 적절한 지 확인해주세요.

다음과 같은 방법으로 프로젝트가 모노레포에 제대로 통합되었는 지 확인할 수 있습니다.

- 레포지토리 루트에서 `yarn` 명령어로 워크스페이스 재구성
- `yarn workspaces list` 명령어로 워크스페이스의 목록을 확인하여, 새로 생성한 프로젝트가 포함되어 있는 지 확인

제대로 통합이 되었다면 이제 해당 프로젝트에서 `yarn dev`, `yarn add ~~~` 등의 명령어를 사용하기 위해 디렉토리를 이동할 필요가 없습니다! 레포지토리의 루트 디렉토리에서 `yarn workspace ${워크스페이스 이름} ${명령어}`를 입력하여 워크스페이스 단위로 명령어를 실행시키는 것이 가능합니다.

### 3. (optional) 프로젝트 alias 등록하기

매번 `yarn workspace`를 입력하기 귀찮으니 alias를 등록해봅시다. 레포지토리 루트에 위치한 `package.json`의 `scripts`에다 `yarn workspace ${프로젝트 이름}` 명령어를 등록해주시면 됩니다.
예를 들어, cycle 1 / 2에서 진행한 프로젝트의 alias는 다음과 같습니다.

```json
"scripts": {
  "paper": "yarn workspace paper",
  "disk-on": "yarn workspace disk-on",
  "waffle-sans": "yarn workspace waffle-sans"
}
```
