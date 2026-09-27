# 3D FAB

React + TypeScript + React Three Fiber로 반도체 공장을 하나씩 만드는 학습 프로젝트.
현재 **1단계와 2단계**를 각각 독립된 페이지와 소스 파일로 제공한다.

## 실행

Node.js 22.12 이상인 22.x 또는 지원되는 최신 LTS와 pnpm 10.32.1을 사용한다.

```sh
pnpm install
pnpm dev
```

터미널에 표시된 로컬 주소를 브라우저로 열면 1단계로 이동한다. 상단 메뉴에서 단계를 선택한다.

| 페이지 | 소스 파일 | 내용 |
|---|---|---|
| `/steps/01` | [Step01.tsx](src/pages/Step01.tsx) | 원점에 박스 하나 표시 |
| `/steps/02` | [Step02.tsx](src/pages/Step02.tsx) | 바닥과 격자 위에 박스 배치 |

각 파일에 해당 단계의 전체 장면 코드가 들어 있다. 실습하려는 단계의 파일을 수정하면 된다. 새 단계는 새 파일로 추가하며 이전 단계 코드는 유지한다. 1단계에서 직접 바꾼 `tomato` 색상도 보존했다.

`main.tsx`의 `BrowserRouter`가 라우팅을 활성화하고, `App.tsx`의 `Routes`와 `Route`가 주소에 맞는 페이지를 표시한다. `NavLink`로 새로고침 없이 이동하며 현재 단계가 강조된다. 단계 전환 시 해당 장면은 새로 시작한다. 기본 주소와 미등록 주소는 1단계로 이동한다.

Vite 개발·미리보기 서버에서는 단계 주소로 직접 접속하거나 새로고침할 수 있다. 추후 정적 호스팅 시에는 `/steps/*` 요청이 `index.html`을 제공하도록 설정한다.

```sh
pnpm typecheck
pnpm build
```

## 첫 번째 장면 이해하기

장면 코드는 [src/pages/Step01.tsx](src/pages/Step01.tsx)에 있다.

- `Canvas`: Three.js의 장면, 카메라, 렌더러를 준비한다.
- `mesh`: geometry와 material을 결합한다. Three.js의 `Mesh`에 해당한다.
- `boxGeometry`: 박스의 모양을 만든다. `args`는 가로·높이·깊이다.
- `meshBasicMaterial`: 조명 없이 색을 표시한다. `wireframe`으로 삼각형 선을 보여주므로 면을 가르는 대각선도 보인다.

카메라는 `[3, 2, 4]`에서 원점의 박스를 바라본다. 박스의 `args`를 `[1, 2, 1]`로 바꾸면 높이가 두 배가 된다. `color`를 바꾸면 색상이 달라진다.

## 두 번째 장면: 바닥과 좌표

장면 코드는 [src/pages/Step02.tsx](src/pages/Step02.tsx)에 있다. 카메라는 `[8, 6, 8]`에서 바닥 중앙인 원점을 바라본다. 바닥 전체를 볼 수 있도록 1단계보다 뒤로 이동했다. 카메라 조작은 3단계에서 추가한다.

- 좌표는 `[X, Y, Z]` 순서다. X와 Z는 바닥 방향, Y는 높이이며 1단위는 1m다.
- `planeGeometry args={[6, 6]}`은 6m × 6m 평면이다. 평면은 처음에 XY 방향이므로 `rotation={[-Math.PI / 2, 0, 0]}`으로 눕혀 Y=0인 바닥을 만든다. 회전 단위는 라디안이며 `Math.PI / 2`는 90도다.
- `gridHelper`는 XZ 방향의 격자를 만든다. `args`의 앞 두 값 `[6, 6]`은 전체 크기와 분할 수이므로 한 칸은 1m다. 뒤 두 값은 중앙선과 나머지 선의 색상이다.
- 격자의 Y를 `0.01`로 지정해 바닥과 같은 위치에서 겹쳐 깜빡이는 현상을 방지한다.
- 박스의 `position`은 중심 위치다. 높이 1m인 박스를 `[0, 0.5, 0]`에 놓으면 밑면이 Y=0인 바닥에 닿는다.
- `scale`은 각 축의 크기 배율이며 기본값은 `[1, 1, 1]`이다. geometry 크기에 배율이 곱해지며 물체 중심을 기준으로 커진다.

## 직접 바꿔보기

`Step02.tsx`를 한 번에 하나씩 수정하고 저장한 뒤 2단계 페이지에서 화면 변화를 확인한다. 1단계 페이지는 영향을 받지 않는다.

1. 박스의 `position={[0, 0.5, 0]}`을 `position={[1, 0.5, 0]}`으로 바꾸면 X 방향으로 한 칸 이동한다. 세 번째 값을 바꾸면 Z 방향으로 이동한다.
2. 박스의 Y를 `1.5`로 바꾸면 밑면이 바닥에서 1m 떠오른다. 확인한 뒤 `0.5`로 되돌린다.
3. 박스의 `<mesh>`에 `rotation={[0, Math.PI / 4, 0]}`을 추가하면 바닥에 선 상태로 45도 회전한다.
4. 박스의 `<mesh>`에 `scale={[1, 2, 1]}`을 추가하면 높이가 두 배가 된다. 바닥에 맞추려면 `position`의 Y도 `1`로 바꾼다. 실습 후에는 scale을 지우고 Y를 `0.5`로 되돌린다.
5. `color="tomato"`를 `color="orange"`로 바꾸면 주황색이 된다. `wireframe`을 지우면 면이 채워진다. 기본 재질은 조명에 반응하지 않아 면마다 같은 색으로 보인다. 입체적인 명암은 4단계에서 다룬다.

창 크기를 바꿨을 때 박스 비율이 유지되고 브라우저 콘솔에 오류가 없는지도 확인한다.

전체 학습 순서는 [구현 계획](docs/implementation-plan.md)을 따른다. 다음 단계는 마우스로 장면을 회전·확대·이동하는 것이다.

## 참고

- [React Router 라우팅](https://reactrouter.com/start/declarative/routing)
- [React Three Fiber 설치 및 호환성](https://r3f.docs.pmnd.rs/getting-started/installation)
- [React Three Fiber 첫 장면](https://r3f.docs.pmnd.rs/getting-started/your-first-scene)
- [Vite 시작하기](https://vite.dev/guide/)
