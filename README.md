# 3D FAB

React + TypeScript + React Three Fiber로 반도체 공장을 하나씩 만드는 학습 프로젝트.
현재 구현 범위는 **1단계: 화면에 박스 하나 표시**다.

## 실행

Node.js 22.12 이상인 22.x 또는 지원되는 최신 LTS와 pnpm 10.32.1을 사용한다.

```sh
pnpm install
pnpm dev
```

터미널에 표시된 로컬 주소를 브라우저로 열면 파란색 와이어프레임 박스가 보인다.

```sh
pnpm typecheck
pnpm build
```

## 첫 번째 장면 이해하기

장면 코드는 [src/App.tsx](src/App.tsx)에 있다.

- `Canvas`: Three.js의 장면, 카메라, 렌더러를 준비한다.
- `mesh`: geometry와 material을 결합한다. Three.js의 `Mesh`에 해당한다.
- `boxGeometry`: 박스의 모양을 만든다. `args`는 가로·높이·깊이다.
- `meshBasicMaterial`: 조명 없이 색을 표시한다. `wireframe`으로 삼각형 선을 보여주므로 면을 가르는 대각선도 보인다.

카메라는 `[3, 2, 4]`에서 원점에 있는 박스를 바라본다. 카메라 조작은 3단계에서 추가한다.

## 직접 바꿔보기

한 번에 하나씩 수정하고 저장한 뒤 화면 변화를 확인한다.

1. `args={[1, 1, 1]}`을 `args={[1, 2, 1]}`로 바꾸면 높이가 두 배가 된다.
2. `color="#2563eb"`를 `color="#f97316"`으로 바꾸면 주황색 박스가 된다.
3. `wireframe`을 지우면 면이 채워진다. 기본 재질은 조명에 반응하지 않아 면마다 같은 색으로 보인다. 입체적인 명암은 4단계에서 다룬다.

창 크기를 바꿨을 때 박스 비율이 유지되고 브라우저 콘솔에 오류가 없는지도 확인한다.

전체 학습 순서는 [구현 계획](docs/implementation-plan.md)을 따른다. 다음 단계는 바닥과 격자를 추가하는 것이다.

## 참고

- [React Three Fiber 설치 및 호환성](https://r3f.docs.pmnd.rs/getting-started/installation)
- [React Three Fiber 첫 장면](https://r3f.docs.pmnd.rs/getting-started/your-first-scene)
- [Vite 시작하기](https://vite.dev/guide/)
