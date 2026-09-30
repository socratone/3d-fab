/**
 * 화면을 그리지 않고 운반 규칙만 계산하는 파일이다.
 * 격자는 [X, Z]로 표현하고 높이 Y는 화면에 표시할 때 별도로 계산한다.
 * 이동 흐름: createTransport로 시작 → advanceTransport로 시간 진행 → transportPosition으로 3D 위치 계산.
 */
// readonly 튜플은 두 숫자로 된 좌표이며, 타입 검사 단계에서 요소를 직접 수정하지 못하게 한다.
export type Cell = readonly [number, number];
export type Direction = "north" | "east" | "south" | "west";
export type Belt = { cell: Cell; direction: Direction };
// cell은 현재 구간의 출발 칸, destination은 도착 칸이다.
// progress는 두 칸 중심 사이를 얼마나 이동했는지 나타낸다(0: 출발, 0.5: 절반, 1: 도착).
export type TransportState = {
  cell: Cell;
  destination: Cell;
  progress: number;
  status: "moving" | "discharged";
};

// 길이 단위는 m, 시간 단위는 초다. 한 칸이 1m이므로 SPEED=1은 초당 한 칸이다.
export const GRID_SIZE = 8;
export const BELT_HEIGHT = 0.38;
export const SPEED = 1;
// 각 방향으로 한 칸 이동할 때 더할 [X, Z]. 북쪽은 -Z, 동쪽은 +X다.
export const vectors: Record<Direction, Cell> = {
  north: [0, -1], east: [1, 0], south: [0, 1], west: [-1, 0],
};
// 벨트 모델의 기본 진행 방향은 북쪽(-Z). Y축 회전으로 나머지 방향을 만든다.
// Three.js의 회전 단위는 라디안이며 Math.PI는 180도다.
export const rotations: Record<Direction, number> = {
  north: 0, east: -Math.PI / 2, south: Math.PI, west: Math.PI / 2,
};
// 배열 대신 "1,2" 같은 문자열을 Map의 키로 써서 같은 좌표의 벨트를 찾는다.
export const cellKey = (cell: Cell) => `${cell[0]},${cell[1]}`;
// 격자 인덱스 0~7을 -3.5~3.5로 옮겨 8×8 바닥의 중심을 3D 원점에 맞춘다.
export const worldPosition = (cell: Cell): [number, number] =>
  [cell[0] - (GRID_SIZE - 1) / 2, cell[1] - (GRID_SIZE - 1) / 2];

// Array.from은 지정한 개수만큼 벨트를 만들고, ...는 각 배열을 하나의 배열로 펼친다.
// 모서리 칸에는 다음 진행 방향의 벨트를 둔다. 예: [5, 1]에서는 남쪽으로 꺾인다.
// 동 → 남 → 서 → 북으로 연결되며, 마지막 [2, 3] 벨트는 빈 바닥 [2, 2]로 배출한다.
export const demoBelts: Belt[] = [
  ...Array.from({ length: 4 }, (_, i): Belt => ({ cell: [1 + i, 1], direction: "east" })),
  ...Array.from({ length: 4 }, (_, i): Belt => ({ cell: [5, 1 + i], direction: "south" })),
  ...Array.from({ length: 3 }, (_, i): Belt => ({ cell: [5 - i, 5], direction: "west" })),
  ...Array.from({ length: 3 }, (_, i): Belt => ({ cell: [2, 5 - i], direction: "north" })),
];
// 렌더링에는 배열을, 특정 칸의 벨트를 조회하는 이동 계산에는 Map을 사용한다.
export const demoLayout = new Map(demoBelts.map((belt) => [cellKey(belt.cell), belt]));

// 현재 벨트의 방향 벡터를 좌표에 더하면 다음 목적지가 된다.
const nextCell = (belt: Belt): Cell => {
  const [x, z] = vectors[belt.direction];
  return [belt.cell[0] + x, belt.cell[1] + z];
};

// 시작 칸에 벨트가 없으면 처음부터 배출 완료 상태로 둔다.
export const createTransport = (start: Cell, layout: ReadonlyMap<string, Belt>): TransportState => {
  const belt = layout.get(cellKey(start));
  return {
    cell: start, destination: belt ? nextCell(belt) : start,
    progress: 0, status: belt ? "moving" : "discharged",
  };
};

/**
 * 경과 시간만큼 이동한 새 상태를 반환한다. 전달받은 state 자체는 수정하지 않는다.
 * 예: progress=0.8일 때 0.5초를 속도 1로 진행하면 한 칸 도착 후 다음 구간의 0.3까지 간다.
 */
export const advanceTransport = (
  state: TransportState, delta: number, layout: ReadonlyMap<string, Belt>,
  paused = false, speed = SPEED,
): TransportState => {
  // 일시정지·배출 완료 상태이거나 시간/속도가 유효하지 않으면 현재 상태를 그대로 유지한다.
  if (paused || state.status === "discharged" || !Number.isFinite(delta) || delta <= 0 || !Number.isFinite(speed) || speed <= 0) return state;
  // 시간 × 속도 = 이동 거리(칸). 기존 진행량에 이번 프레임의 이동량을 더한다.
  let remaining = state.progress + delta * speed;
  let cell = state.cell;
  let destination = state.destination;
  // 느린 프레임에서는 여러 칸을 지날 수 있으므로 if가 아니라 while로 도착을 모두 처리한다.
  while (remaining >= 1) {
    cell = destination;
    remaining -= 1;
    const belt = layout.get(cellKey(cell));
    // 도착 칸에 벨트가 없으면 그 칸에서 운반을 끝낸다.
    if (!belt) return { cell, destination: cell, progress: 0, status: "discharged" };
    destination = nextCell(belt);
  }
  return { cell, destination, progress: remaining, status: "moving" };
};

// 논리적 이동 상태를 렌더링에 사용할 [X, Y, Z] 좌표로 바꾼다.
export const transportPosition = (state: TransportState, layout: ReadonlyMap<string, Belt>): [number, number, number] => {
  const [x, z] = worldPosition(state.cell);
  const [nextX, nextZ] = worldPosition(state.destination);
  const fromHeight = layout.has(cellKey(state.cell)) ? BELT_HEIGHT : 0;
  const toHeight = layout.has(cellKey(state.destination)) ? BELT_HEIGHT : 0;
  // 벨트 위 높이는 BELT_HEIGHT, 빈 바닥은 0이다.
  // 높이에만 smoothstep 수식 p²(3−2p)를 적용해 내려오기 시작할 때와 끝날 때 움직임을 완만하게 한다.
  // X와 Z는 시작값 + (도착값 − 시작값) × 진행률로 계산하므로 수평 이동 속도는 일정하다.
  const descent = state.progress * state.progress * (3 - 2 * state.progress);
  return [x + (nextX - x) * state.progress, fromHeight + (toHeight - fromHeight) * descent, z + (nextZ - z) * state.progress];
};
