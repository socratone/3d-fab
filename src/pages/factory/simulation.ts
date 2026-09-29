export type Cell = readonly [number, number];
export type Direction = "north" | "east" | "south" | "west";
export type Belt = { cell: Cell; direction: Direction };
export type TransportState = {
  cell: Cell;
  destination: Cell;
  progress: number;
  status: "moving" | "discharged";
};

export const GRID_SIZE = 8;
export const BELT_HEIGHT = 0.38;
export const SPEED = 1;
export const vectors: Record<Direction, Cell> = {
  north: [0, -1], east: [1, 0], south: [0, 1], west: [-1, 0],
};
export const rotations: Record<Direction, number> = {
  north: 0, east: -Math.PI / 2, south: Math.PI, west: Math.PI / 2,
};
export const cellKey = (cell: Cell) => `${cell[0]},${cell[1]}`;
export const worldPosition = (cell: Cell): [number, number] =>
  [cell[0] - (GRID_SIZE - 1) / 2, cell[1] - (GRID_SIZE - 1) / 2];

// Every corner belongs to its outgoing segment.
export const demoBelts: Belt[] = [
  ...Array.from({ length: 4 }, (_, i): Belt => ({ cell: [1 + i, 1], direction: "east" })),
  ...Array.from({ length: 4 }, (_, i): Belt => ({ cell: [5, 1 + i], direction: "south" })),
  ...Array.from({ length: 3 }, (_, i): Belt => ({ cell: [5 - i, 5], direction: "west" })),
  ...Array.from({ length: 3 }, (_, i): Belt => ({ cell: [2, 5 - i], direction: "north" })),
];
export const demoLayout = new Map(demoBelts.map((belt) => [cellKey(belt.cell), belt]));

const nextCell = (belt: Belt): Cell => {
  const [x, z] = vectors[belt.direction];
  return [belt.cell[0] + x, belt.cell[1] + z];
};

export const createTransport = (start: Cell, layout: ReadonlyMap<string, Belt>): TransportState => {
  const belt = layout.get(cellKey(start));
  return {
    cell: start, destination: belt ? nextCell(belt) : start,
    progress: 0, status: belt ? "moving" : "discharged",
  };
};

/** Consume whole cell transitions before interpolating the remaining distance. */
export const advanceTransport = (
  state: TransportState, delta: number, layout: ReadonlyMap<string, Belt>,
  paused = false, speed = SPEED,
): TransportState => {
  if (paused || state.status === "discharged" || !Number.isFinite(delta) || delta <= 0 || !Number.isFinite(speed) || speed <= 0) return state;
  let remaining = state.progress + delta * speed;
  let cell = state.cell;
  let destination = state.destination;
  while (remaining >= 1) {
    cell = destination;
    remaining -= 1;
    const belt = layout.get(cellKey(cell));
    if (!belt) return { cell, destination: cell, progress: 0, status: "discharged" };
    destination = nextCell(belt);
  }
  return { cell, destination, progress: remaining, status: "moving" };
};

export const transportPosition = (state: TransportState, layout: ReadonlyMap<string, Belt>): [number, number, number] => {
  const [x, z] = worldPosition(state.cell);
  const [nextX, nextZ] = worldPosition(state.destination);
  const fromHeight = layout.has(cellKey(state.cell)) ? BELT_HEIGHT : 0;
  const toHeight = layout.has(cellKey(state.destination)) ? BELT_HEIGHT : 0;
  // Ease the descent onto the floor without changing horizontal belt speed.
  const descent = state.progress * state.progress * (3 - 2 * state.progress);
  return [x + (nextX - x) * state.progress, fromHeight + (toHeight - fromHeight) * descent, z + (nextZ - z) * state.progress];
};
