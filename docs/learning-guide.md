# 1~9단계 학습 가이드

상단 메뉴에서 단계별 페이지를 열고 해당 소스 파일을 수정한다. 새 단계는 이전 장면을 복사해 확장한 독립된 예제이므로, 실습 중 이전 단계로 돌아가 비교할 수 있다. 한 번에 값을 하나씩 바꾸고 저장한 뒤 화면의 차이를 확인한다.

## 시작하기

프로젝트 폴더에서 실행한다.

```sh
pnpm install
pnpm dev
```

터미널에 표시된 주소를 열면 1단계로 이동한다. 상단 메뉴는 가로로 스크롤할 수 있다. 1·2단계의 카메라는 고정되어 있으며, 3단계부터 왼쪽 드래그로 회전, 휠로 확대·축소, 오른쪽 드래그로 이동한다.

| 단계 | 페이지 | 핵심 개념 |
|---|---|---|
| 1 | `/steps/01` | Canvas, mesh, geometry, material |
| 2 | `/steps/02` | 좌표, 위치, 회전, 크기 |
| 3 | `/steps/03` | 원근 카메라, OrbitControls |
| 4 | `/steps/04` | 조명과 빛에 반응하는 재질 |
| 5 | `/steps/05` | group, 상대 좌표, props |
| 6 | `/steps/06` | 배치 데이터, 타입, map |
| 7 | `/steps/07` | 클릭 이벤트와 선택 상태 |
| 8 | `/steps/08` | 상태 타입과 색상 표현 |
| 9 | `/steps/09` | useFrame, useRef, 시간 기반 이동 |

`App.tsx`는 React Router의 메뉴와 라우트를 담당한다. 실습할 장면은 각 `StepXX.tsx`에서 수정한다. 5단계부터는 장비 등 일부 코드가 단계 전용 폴더로 분리되어 있다. 페이지를 이동하거나 새로고침하면 시점과 장비 상태는 초기화되지만, 파일에 저장한 코드 수정은 유지된다.

## 1단계: 박스 하나 표시

- 페이지: `/steps/01`
- 코드: [step01/page.tsx](../src/pages/step01/page.tsx)

`Canvas`가 Three.js의 장면·카메라·렌더러를 준비한다. 그 안의 `mesh`는 모양을 정하는 geometry와 표면을 정하는 material을 결합한 물체다. `<mesh>`는 Three.js의 `Mesh`에 해당한다.

```tsx
<mesh>
  <boxGeometry args={[1, 1, 1]} />
  <meshBasicMaterial color="tomato" wireframe />
</mesh>
```

`boxGeometry`의 `args`는 가로·높이·깊이다. `meshBasicMaterial`은 조명 없이 색을 표시하며, `wireframe`은 삼각형의 선을 보여준다. 박스 면에 보이는 대각선도 삼각형을 구성하는 선이다. 카메라는 `[3, 2, 4]`에서 원점의 박스를 바라본다.

실습: `args`를 `[1, 2, 1]`로 바꿔 높이를 두 배로 만든다. `color`를 `orange`로 바꾸고, 마지막으로 `wireframe`을 지워 면이 채워지는지 확인한다. 기본 재질은 빛에 반응하지 않으므로 면마다 같은 색으로 보인다.

## 2단계: 바닥과 기준 격자

- 페이지: `/steps/02`
- 코드: [step02/page.tsx](../src/pages/step02/page.tsx)

좌표는 `[X, Y, Z]` 순서다. Y는 높이, X와 Z는 바닥 방향이며 1단위를 1m로 사용한다. `planeGeometry args={[6, 6]}`으로 6m × 6m 바닥을 만든다. 평면은 원래 XY 방향이므로 `rotation={[-Math.PI / 2, 0, 0]}`으로 X축을 중심으로 -90도 회전해 눕힌다. 회전 단위는 라디안이다.

`gridHelper`의 앞 두 인수 `[6, 6]`은 전체 크기와 분할 수다. 따라서 한 칸은 1m다. 격자를 Y=`0.01`에 놓아 바닥과 겹쳐 깜빡이는 현상을 피한다.

박스의 위치는 중심 기준이다. 높이 1m인 박스를 `position={[0, 0.5, 0]}`에 놓으면 밑면이 Y=0인 바닥에 닿는다. `scale`은 각 축의 크기 배율이며 물체 중심을 기준으로 적용된다.

실습: 박스의 위치를 `[1, 0.5, 0]`으로 바꿔 X 방향으로 한 칸 이동한다. `<mesh>`에 `rotation={[0, Math.PI / 4, 0]}`을 추가하면 Y축을 중심으로 45도 회전한다. `scale={[1, 2, 1]}`로 높이를 두 배로 만들 때는 중심 Y도 `1`로 바꿔 바닥에 맞춘다.

## 3단계: 마우스로 둘러보기

- 페이지: `/steps/03`
- 코드: [step03/page.tsx](../src/pages/step03/page.tsx)

Drei의 `OrbitControls`가 마우스 입력에 따라 카메라를 움직인다. 물체의 위치는 바뀌지 않는다. `Canvas`의 기본 원근 카메라는 가까운 물체를 크게, 먼 물체를 작게 보여준다. `fov`는 세로 시야각이며 이 단계의 휠 확대는 시야각 대신 카메라와 중심 사이의 거리를 바꾼다.

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

`target`은 처음 바라보는 중심이다. `minDistance`와 `maxDistance`는 중심으로부터의 거리 제한이다. `maxPolarAngle`은 위쪽 Y축에서 잰 회전 각도의 상한으로, 카메라가 바닥 아래로 회전하지 않게 한다. `screenSpacePanning={false}`는 오른쪽 드래그 이동을 XZ 바닥 방향으로 제한한다.

실습: 왼쪽 드래그·휠·오른쪽 드래그를 각각 시도한다. `enableDamping`을 `true`로 바꾸면 드래그를 놓은 뒤 움직임이 부드럽게 잦아든다. 새로고침하거나 다른 단계로 이동했다가 돌아오면 처음 시점에서 시작한다.

## 4단계: 조명과 재질

- 페이지: `/steps/04`
- 코드: [step04/page.tsx](../src/pages/step04/page.tsx)

3단계의 와이어프레임을 면이 채워진 `meshStandardMaterial`로 바꿨다. `ambientLight`는 전체를 은은하게 밝히고, `directionalLight`는 빛의 방향에 따라 각 면의 밝기를 다르게 만든다. 물체의 입체감을 명암으로 표현하며, 바닥에 드리우는 그림자는 아직 추가하지 않았다.

실습: 방향광의 `position={[3, 5, 2]}`에서 X를 `-3`으로 바꾸고 밝은 면이 달라지는지 확인한다. `intensity`를 `0`으로 바꾸면 주변광만 남는다. `roughness`는 표면의 거칠기, `metalness`는 금속성이다. 각각 0~1 사이에서 바꾸며 비교한다.

## 5단계: 장비 한 대 조립

- 페이지: `/steps/05`
- 코드: [step05/page.tsx](../src/pages/step05/page.tsx), [Equipment.tsx](../src/pages/step05/components/Equipment.tsx)

장비는 본체·문·표시창이라는 세 개의 박스다. `group`으로 묶으면 한 번에 이동할 수 있다. 장비 원점을 바닥으로 정했기 때문에 본체 중심 Y는 `0.8`이고 높이는 `1.6`이다. 문과 표시창의 위치는 장비 원점에 대한 상대 좌표다.

실습: 페이지의 `<Equipment>`에 전달하는 `position`을 `[1, 0, 0]`으로 바꾸면 모든 부품이 함께 이동한다. 장비 컴포넌트에서 표시창의 Y만 바꾸면 표시창만 이동한다. `name`과 `position`은 TypeScript로 정의한 props다.

## 6단계: 장비 4대와 통로

- 페이지: `/steps/06`
- 코드: [step06/page.tsx](../src/pages/step06/page.tsx), [Equipment.tsx](../src/pages/step06/components/Equipment.tsx)

`EquipmentData`는 ID·이름·위치를 가진 타입이다. `equipmentData` 배열의 네 항목을 `map`으로 장비 컴포넌트에 연결한다. 가운데 폭 2m의 통로를 두고 좌우에 장비를 배치했다. `key`는 각 장비를 구분하는 고유 ID다.

실습: 첫 번째 장비의 Z를 `-2`에서 `-3`으로 바꿔 본다. 배열에 고유한 ID를 가진 장비를 추가하면 같은 모양의 장비가 하나 더 표시된다. 5단계의 장비는 바뀌지 않는다.

## 7단계: 클릭으로 장비 선택

- 페이지: `/steps/07`
- 코드: [step07/page.tsx](../src/pages/step07/page.tsx), [Equipment.tsx](../src/pages/step07/components/Equipment.tsx)

React Three Fiber는 내부 Raycaster로 마우스 위치와 겹치는 3D 물체를 찾아 클릭 이벤트를 전달한다. 부품의 클릭은 부모 `group`으로 전달된다. `event.stopPropagation()`은 그 뒤의 바닥까지 클릭이 전달되어 선택이 바로 풀리는 것을 막는다.

선택한 ID는 `useState<string | null>`로 관리한다. ID에 해당하는 장비의 본체는 파란색이 되고, 이름은 Canvas 밖의 HTML 패널에 표시된다. 바닥 클릭, 빈 공간의 `onPointerMissed`, 선택 해제 버튼으로 선택을 해제한다.

실습: 장비 본체·문·표시창을 각각 클릭해 모두 같은 장비가 선택되는지 확인한다. 다른 장비를 클릭하면 이름이 바뀌며, 바닥을 클릭하면 해제된다.

## 8단계: 장비 상태

- 페이지: `/steps/08`
- 코드: [step08/page.tsx](../src/pages/step08/page.tsx), [Equipment.tsx](../src/pages/step08/components/Equipment.tsx), [status.ts](../src/pages/step08/status.ts)

상태는 `'idle' | 'running' | 'error'` 유니언 타입이다. 표시등은 대기일 때 주황색, 가동일 때 초록색, 오류일 때 빨간색이다. 본체의 파란색은 선택 여부이므로 상태 색상과 구분된다.

장비를 선택한 후 상태 버튼을 누르면 배열에서 해당 ID의 데이터만 새 객체로 변경한다. React가 새 상태를 장비의 props로 전달하면 표시등 색상이 바뀐다. 다른 장비는 그대로 유지된다.

실습: 한 장비를 오류로 바꾼 뒤 다른 장비를 선택하고 다시 돌아와 상태가 유지되는지 확인한다. 새로고침하면 초기 데이터로 돌아온다. 현재 상태는 화면 실습용이며 서버에 저장하지 않는다.

## 9단계: 시간에 따른 운반체 이동

- 페이지: `/steps/09`
- 코드: [step09/page.tsx](../src/pages/step09/page.tsx), [Transport.tsx](../src/pages/step09/components/Transport.tsx)

운반체는 본체와 적재함을 묶은 `group`이다. `useRef<Group>`으로 실제 Three.js 객체를 참조하고, `useFrame`에서 그 위치를 갱신한다. 매 프레임 React 상태를 변경하지 않는다.

`delta`는 이전 프레임 이후 흐른 초다. 누적 시간에 속도 1m/s를 곱해 이동 거리를 구한다. 5m를 이동한 후 반대 방향으로 돌아오므로 왕복 주기는 10초다. 나머지 연산으로 왕복 경로 안에 위치를 유지해, 긴 프레임에서도 끝점을 지나쳐 바닥 밖으로 벗어나지 않는다.

실습: `speed`를 `2`로 바꾸면 왕복 주기가 5초가 된다. 일시정지하면 누적 시간도 멈추며, 재개하면 그 위치부터 이동한다. 페이지를 다시 열면 초기 위치에서 시작한다. 실제 웨이퍼 이송이나 장비 상태에 따른 물류 제어는 이 예제의 범위에 포함하지 않는다.

## 확인 순서

1. `pnpm build`로 TypeScript 검사와 프로덕션 빌드를 확인한다.
2. 각 단계의 직접 주소, 메뉴 이동, 새로고침, 뒤로가기를 확인한다.
3. 1단계 박스, 2단계 바닥·격자와 박스 위치, 3단계 회전·확대·이동을 확인한다.
4. 4단계 명암, 5단계 부품, 6단계 네 장비와 통로를 확인한다.
5. 7단계 장비 선택·해제, 8단계 상태별 표시등과 다른 장비의 상태 보존을 확인한다.
6. 9단계 양 끝점 왕복과 일시정지·재개를 확인한다.

참고: [R3F 이벤트](https://r3f.docs.pmnd.rs/api/events), [useFrame](https://r3f.docs.pmnd.rs/api/hooks).
