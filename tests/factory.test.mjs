import assert from "node:assert/strict";
import test from "node:test";
import { advanceTransport, BELT_HEIGHT, cellKey, createTransport, demoBelts, demoLayout, transportPosition, vectors } from "../src/pages/factory01/simulation.ts";

test("each direction moves to the adjacent cell, then stops on the floor", () => {
  for (const [direction, vector] of Object.entries(vectors)) {
    const cell = [3, 3];
    const layout = new Map([[cellKey(cell), { cell, direction }]]);
    const initial = createTransport(cell, layout);
    const half = advanceTransport(initial, 0.5, layout);
    assert.deepEqual(half.destination, [3 + vector[0], 3 + vector[1]]);
    assert.equal(half.progress, 0.5);
    const position = transportPosition(half, layout);
    assert.deepEqual(position, [-0.5 + vector[0] / 2, BELT_HEIGHT / 2, -0.5 + vector[1] / 2]);
    const final = advanceTransport(half, 0.5, layout);
    assert.equal(final.status, "discharged");
    assert.equal(transportPosition(final, layout)[1], 0);
    assert.equal(advanceTransport(final, 10, layout), final);
  }
});

test("demo turns at cell centers and discharges after fourteen steps", () => {
  const initial = createTransport([1, 1], demoLayout);
  for (const [seconds, cell, destination] of [
    [4, [5, 1], [5, 2]], [8, [5, 5], [4, 5]], [11, [2, 5], [2, 4]], [13, [2, 3], [2, 2]],
  ]) {
    const state = advanceTransport(initial, seconds, demoLayout);
    assert.deepEqual(state.cell, cell);
    assert.deepEqual(state.destination, destination);
    assert.equal(state.progress, 0);
    assert.equal(transportPosition(state, demoLayout)[1], BELT_HEIGHT);
  }
  const done = advanceTransport(initial, 14, demoLayout);
  assert.equal(done.status, "discharged");
  assert.deepEqual(done.cell, [2, 2]);
  assert.equal(demoLayout.size, demoBelts.length);
});

test("frame rates and long frames preserve the route and elapsed distance", () => {
  const initial = createTransport([1, 1], demoLayout);
  const expected = advanceTransport(initial, 11.5, demoLayout);
  for (const fps of [30, 60, 144]) {
    let actual = initial;
    for (let frame = 0; frame < 11.5 * fps; frame++) actual = advanceTransport(actual, 1 / fps, demoLayout);
    assert.deepEqual(actual.cell, expected.cell);
    assert.deepEqual(actual.destination, expected.destination);
    assert.ok(Math.abs(actual.progress - expected.progress) < 1e-10);
  }
  assert.deepEqual(advanceTransport(initial, 100, demoLayout).cell, [2, 2]);
});

test("pause preserves progress, resume continues, and restart resets", () => {
  const initial = createTransport([1, 1], demoLayout);
  const moving = advanceTransport(initial, 2.25, demoLayout);
  assert.equal(advanceTransport(moving, 10, demoLayout, true), moving);
  assert.deepEqual(advanceTransport(moving, 0.75, demoLayout), advanceTransport(initial, 3, demoLayout));
  assert.deepEqual(createTransport([1, 1], demoLayout), initial);
  assert.equal(advanceTransport(moving, Number.NaN, demoLayout), moving);
  assert.equal(advanceTransport(moving, -1, demoLayout), moving);
});

test("transport on a floor cell starts stationary", () => {
  const state = createTransport([0, 0], demoLayout);
  assert.equal(state.status, "discharged");
  assert.equal(advanceTransport(state, 1, demoLayout), state);
});
