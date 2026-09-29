# 3D FAB

React + TypeScript + React Three Fiber로 반도체 공장을 하나씩 만드는 학습 프로젝트.
현재 **1~9단계**를 각각 독립된 페이지와 소스 파일로 제공하며, 별도의 **공장 만들기** 화면에서 컨베이어 기반 운반을 실험할 수 있다.

## 실행

Node.js 22.12 이상인 22.x 또는 지원되는 최신 LTS와 pnpm 10.32.1을 사용한다.

```sh
pnpm install
pnpm dev
```

터미널에 표시된 로컬 주소를 브라우저로 열면 루트(`/`)의 페이지 모음이 표시된다. 공장 만들기 또는 각 학습 단계의 링크를 선택한다. 개별 페이지에는 공통 내비게이션이 없으며 브라우저 뒤로 가기로 목록에 돌아올 수 있다.

| 페이지 | 소스 파일 | 내용 |
|---|---|---|
| `/` | [home/page.tsx](src/pages/home/page.tsx) | 공장 및 학습 페이지 링크 모음 |
| `/factory` | [factory/page.tsx](src/pages/factory/page.tsx) | 1×1 컨베이어와 웨이퍼 운반함 |
| `/steps/01` | [step01/page.tsx](src/pages/step01/page.tsx) | 원점에 박스 하나 표시 |
| `/steps/02` | [step02/page.tsx](src/pages/step02/page.tsx) | 바닥과 격자 위에 박스 배치 |
| `/steps/03` | [step03/page.tsx](src/pages/step03/page.tsx) | 마우스로 회전·확대·이동 |
| `/steps/04` | [step04/page.tsx](src/pages/step04/page.tsx) | 조명과 재질 |
| `/steps/05` | [step05/page.tsx](src/pages/step05/page.tsx) | 본체·문·표시창으로 장비 조립 |
| `/steps/06` | [step06/page.tsx](src/pages/step06/page.tsx) | 장비 4대와 중앙 통로 |
| `/steps/07` | [step07/page.tsx](src/pages/step07/page.tsx) | 장비 클릭과 이름 표시 |
| `/steps/08` | [step08/page.tsx](src/pages/step08/page.tsx) | 장비 상태 변경과 표시등 |
| `/steps/09` | [step09/page.tsx](src/pages/step09/page.tsx) | 운반체 왕복 이동 |

각 파일에 해당 단계의 전체 장면 코드가 들어 있다. 실습하려는 단계의 파일을 수정하면 된다. 새 단계는 새 파일로 추가하며 이전 단계 코드는 유지한다. 1단계에서 직접 바꾼 `tomato` 색상도 보존했다.

`main.tsx`의 `BrowserRouter`가 라우팅을 활성화하고, `App.tsx`의 `Routes`와 `Route`가 주소에 맞는 페이지를 표시한다. 루트 페이지의 `Link`로 새로고침 없이 이동한다. 단계 전환 시 해당 장면은 새로 시작한다. 기본 주소는 페이지 모음을 표시하고 미등록 주소는 루트로 이동한다.

Vite 개발·미리보기 서버에서는 단계 주소로 직접 접속하거나 새로고침할 수 있다. 추후 정적 호스팅 시에는 `/steps/*` 요청이 `index.html`을 제공하도록 설정한다.

```sh
pnpm typecheck
pnpm build
pnpm test
```

## 공장 만들기: 컨베이어 라인

루트 페이지의 **컨베이어 라인** 링크 또는 `/factory`에서 실행한다. 8×8 격자에 고정 배치된 1×1m 컨베이어가 웨이퍼 운반함 한 개를 초당 한 칸씩 운반한다. 상판과 롤러도 같은 방향으로 움직인다.

- 운반함은 동 → 남 → 서 → 북 순서로 칸 중심을 거쳐 이동한다. 각 칸의 벨트 방향이 다음 목적지를 결정한다.
- 마지막 벨트 다음의 노란 바닥 칸으로 내려오면 운반이 완료된다. 배출 후에도 벨트는 계속 움직인다.
- **일시정지/재개**는 벨트와 운반함을 함께 제어한다. **처음부터 재시작**은 위치와 애니메이션 시간을 초기화하고 운전을 시작한다.
- 드래그로 회전, 휠로 확대/축소, 오른쪽 드래그로 화면을 이동한다. 페이지를 다시 열면 처음부터 시작한다.

`src/pages/factory/components/ConveyorBelt.tsx`는 `cell`(정수 격자 좌표), `direction`(`north/east/south/west`), `speed`(칸/초), `paused`를 받는 재사용 컴포넌트다. 좌표는 각 축 0~7이며 동쪽은 +X, 남쪽은 +Z다. 운반 물체 외형은 `WaferCarrier`, 격자 이동 계산은 `simulation.ts`에 분리되어 있다. 다른 외형도 같은 이동 계산을 사용할 수 있다.

현재는 고정 경로와 물체 한 개의 데모이며 직접 배치, 자동 공급, 다중 물체 대기, 저장 기능은 제공하지 않는다. 이동은 물리 엔진 대신 칸 사이 위치 보간으로 처리한다. `pnpm test`는 Node.js 22.12 이상에서 타입 제거 기능으로 이동 로직을 검사한다. 정적 호스팅 시 `/factory` 요청도 `index.html`을 제공하도록 설정한다.

## 첫 번째 장면 이해하기

장면 코드는 [src/pages/step01/page.tsx](src/pages/step01/page.tsx)에 있다.

- `Canvas`: Three.js의 장면, 카메라, 렌더러를 준비한다.
- `mesh`: geometry와 material을 결합한다. Three.js의 `Mesh`에 해당한다.
- `boxGeometry`: 박스의 모양을 만든다. `args`는 가로·높이·깊이다.
- `meshBasicMaterial`: 조명 없이 색을 표시한다. `wireframe`으로 삼각형 선을 보여주므로 면을 가르는 대각선도 보인다.

카메라는 `[3, 2, 4]`에서 원점의 박스를 바라본다. 박스의 `args`를 `[1, 2, 1]`로 바꾸면 높이가 두 배가 된다. `color`를 바꾸면 색상이 달라진다.

## 두 번째 장면: 바닥과 좌표

장면 코드는 [src/pages/step02/page.tsx](src/pages/step02/page.tsx)에 있다. 카메라는 `[8, 6, 8]`에서 바닥 중앙인 원점을 바라본다. 바닥 전체를 볼 수 있도록 1단계보다 뒤로 이동했다. 카메라 조작은 3단계에서 추가한다.

- 좌표는 `[X, Y, Z]` 순서다. X와 Z는 바닥 방향, Y는 높이이며 1단위는 1m다.
- `planeGeometry args={[6, 6]}`은 6m × 6m 평면이다. 평면은 처음에 XY 방향이므로 `rotation={[-Math.PI / 2, 0, 0]}`으로 눕혀 Y=0인 바닥을 만든다. 회전 단위는 라디안이며 `Math.PI / 2`는 90도다.
- `gridHelper`는 XZ 방향의 격자를 만든다. `args`의 앞 두 값 `[6, 6]`은 전체 크기와 분할 수이므로 한 칸은 1m다. 뒤 두 값은 중앙선과 나머지 선의 색상이다.
- 격자의 Y를 `0.01`로 지정해 바닥과 같은 위치에서 겹쳐 깜빡이는 현상을 방지한다.
- 박스의 `position`은 중심 위치다. 높이 1m인 박스를 `[0, 0.5, 0]`에 놓으면 밑면이 Y=0인 바닥에 닿는다.
- `scale`은 각 축의 크기 배율이며 기본값은 `[1, 1, 1]`이다. geometry 크기에 배율이 곱해지며 물체 중심을 기준으로 커진다.

## 직접 바꿔보기

`src/pages/step02/page.tsx`를 한 번에 하나씩 수정하고 저장한 뒤 2단계 페이지에서 화면 변화를 확인한다. 1단계 페이지는 영향을 받지 않는다.

1. 박스의 `position={[0, 0.5, 0]}`을 `position={[1, 0.5, 0]}`으로 바꾸면 X 방향으로 한 칸 이동한다. 세 번째 값을 바꾸면 Z 방향으로 이동한다.
2. 박스의 Y를 `1.5`로 바꾸면 밑면이 바닥에서 1m 떠오른다. 확인한 뒤 `0.5`로 되돌린다.
3. 박스의 `<mesh>`에 `rotation={[0, Math.PI / 4, 0]}`을 추가하면 바닥에 선 상태로 45도 회전한다.
4. 박스의 `<mesh>`에 `scale={[1, 2, 1]}`을 추가하면 높이가 두 배가 된다. 바닥에 맞추려면 `position`의 Y도 `1`로 바꾼다. 실습 후에는 scale을 지우고 Y를 `0.5`로 되돌린다.
5. `color="tomato"`를 `color="orange"`로 바꾸면 주황색이 된다. `wireframe`을 지우면 면이 채워진다. 기본 재질은 조명에 반응하지 않아 면마다 같은 색으로 보인다. 입체적인 명암은 4단계에서 다룬다.

창 크기를 바꿨을 때 박스 비율이 유지되고 브라우저 콘솔에 오류가 없는지도 확인한다.

## 세 번째 장면: 카메라 조작

[step03/page.tsx](src/pages/step03/page.tsx)는 2단계 장면을 복사하고 Drei의 `OrbitControls`를 추가한 독립된 페이지다. 물체의 위치는 그대로 두고 카메라를 움직여 장면을 둘러본다.

| 마우스 조작 | 결과 |
|---|---|
| 왼쪽 버튼 드래그 | 바라보는 중심 주위로 회전 |
| 휠 | 중심에 가까워지거나 멀어지며 확대·축소 |
| 오른쪽 버튼 드래그 | 카메라와 중심을 함께 이동 |

`Canvas`의 기본 카메라는 원근 카메라다. 가까운 물체가 크게, 먼 물체가 작게 보인다. `fov={50}`은 세로 시야각이며, 여기서 휠 확대는 시야각 대신 카메라와 중심 사이의 거리를 바꾼다.

```tsx
<OrbitControls
  target={[0, 0, 0]}
  minDistance={2}
  maxDistance={20}
  maxPolarAngle={Math.PI / 2 - 0.05}
  screenSpacePanning={false}
  enableDamping={false}
/>
```

- `target`: 처음 바라보는 중심. 바닥 중앙에서 회전을 시작한다. 오른쪽 드래그로 이동하면 중심도 함께 바뀐다.
- `minDistance` / `maxDistance`: 중심과 카메라 사이의 최소·최대 거리.
- `maxPolarAngle`: 위쪽 Y축에서 잰 회전 각도의 상한. 수평보다 조금 위에서 멈춰 바닥 아래로 회전하지 않게 한다.
- `screenSpacePanning={false}`: 오른쪽 드래그 시 XZ 바닥 방향으로 이동한다.
- `enableDamping={false}`: 드래그를 놓으면 즉시 멈춘다. `true`로 바꾸면 움직임이 부드럽게 잦아드는 차이를 볼 수 있다.

3단계에서 회전·휠·오른쪽 드래그를 각각 시도해 본다. 처음 시점으로 돌아가려면 새로고침하거나 다른 단계로 이동했다가 돌아오면 된다. 1·2단계는 기존처럼 고정된 카메라를 유지한다.

## 4~9단계 학습

1~9단계 전체의 개념과 실습은 [전체 학습 가이드](docs/learning-guide.md)에 정리했다.

- 4단계: 빛에 반응하는 `meshStandardMaterial`과 주변광·방향광.
- 5단계: `group`과 상대 좌표로 장비의 본체·문·표시창을 조립한다.
- 6단계: 타입이 있는 배치 배열을 `map`으로 장비 4대에 연결한다.
- 7단계: 장비 클릭으로 이름을 표시하고 바닥·빈 공간 클릭으로 선택을 해제한다.
- 8단계: 선택한 장비를 대기·가동·오류로 변경한다. 본체의 파란색은 선택, 위쪽 표시등은 상태를 나타낸다.
- 9단계: 운반체가 통로 위 Z=-2.5~2.5를 1m/s로 왕복한다. 일시정지·재개 버튼을 제공한다.

5단계 이후 장비 컴포넌트는 `src/pages/step05/components/Equipment.tsx`처럼 각 페이지 폴더의 `components/`에 있다. 운반체도 해당 `components/`에 두고, 상태 정의(`status.ts`)는 페이지 파일과 같은 폴더에 두므로 다른 단계의 코드를 수정할 필요가 없다. 장비 상태와 시점은 페이지를 벗어나거나 새로고침하면 초기화된다. 장비 상태 변경은 학습용이며 실제 공정이나 운반체 동작과 연동하지 않는다.

루트 페이지의 링크 카드는 화면 너비에 맞춰 배치된다. 작은 화면에서는 세로로 스크롤해 모든 단계를 선택할 수 있다.

전체 학습 순서는 [구현 계획](docs/implementation-plan.md)을 따른다. 9단계까지의 기본 공장 학습 예제가 구현되어 있다.

## 참고

- [Drei 카메라 컨트롤](https://drei.docs.pmnd.rs/controls/introduction)
- [React Router 라우팅](https://reactrouter.com/start/declarative/routing)
- [React Three Fiber 설치 및 호환성](https://r3f.docs.pmnd.rs/getting-started/installation)
- [React Three Fiber 첫 장면](https://r3f.docs.pmnd.rs/getting-started/your-first-scene)
- [Vite 시작하기](https://vite.dev/guide/)
