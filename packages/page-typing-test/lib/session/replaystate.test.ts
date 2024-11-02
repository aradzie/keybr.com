import { test } from "node:test";
import { Timer } from "@keybr/lang";
import { assert } from "chai";
import { ReplayState } from "./replaystate.ts";

test("no events", () => {
  Timer.now = () => 0;

  const state = new ReplayState([]);

  assert.strictEqual(state.delay, 1000);
  assert.deepStrictEqual(state.depressedKeys, []);

  state.step();
  assert.strictEqual(state.delay, 1000);
  assert.deepStrictEqual(state.depressedKeys, []);

  state.step();
  assert.strictEqual(state.delay, 1000);
  assert.deepStrictEqual(state.depressedKeys, []);
});

test("many events", () => {
  Timer.now = () => 0;

  const state = new ReplayState([
    { timeStamp: 100, type: "keydown", code: "KeyA", key: " ", modifiers: [] },
    { timeStamp: 200, type: "keyup", code: "KeyA", key: " ", modifiers: [] },
    { timeStamp: 300, type: "keydown", code: "KeyB", key: "a", modifiers: [] },
  ]);

  assert.deepStrictEqual(state.depressedKeys, []);
  assert.strictEqual(state.delay, 100);

  state.step();
  assert.deepStrictEqual(state.depressedKeys, ["KeyA"]);
  assert.strictEqual(state.delay, 200);

  state.step();
  assert.deepStrictEqual(state.depressedKeys, []);
  assert.strictEqual(state.delay, 300);

  state.step();
  assert.deepStrictEqual(state.depressedKeys, ["KeyB"]);
  assert.strictEqual(state.delay, 1000);

  state.step();
  assert.deepStrictEqual(state.depressedKeys, []);
  assert.strictEqual(state.delay, 100);

  state.step();
  assert.deepStrictEqual(state.depressedKeys, ["KeyA"]);
  assert.strictEqual(state.delay, 200);
});

test("delay", () => {
  Timer.now = () => 0;

  const state = new ReplayState([
    { timeStamp: 100, type: "keydown", code: "Space", key: " ", modifiers: [] },
  ]);

  assert.strictEqual(state.delay, 100);

  Timer.now = () => 99;

  assert.strictEqual(state.delay, 1);

  Timer.now = () => 100;

  assert.strictEqual(state.delay, 0);

  Timer.now = () => 200;

  assert.strictEqual(state.delay, 0);
});
