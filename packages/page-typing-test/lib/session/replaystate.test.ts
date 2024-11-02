import { test } from "node:test";
import { Timer } from "@keybr/lang";
import { type Step, textInputSettings } from "@keybr/textinput";
import { type AnyEvent } from "@keybr/textinput-events";
import { assert, expect, use } from "chai";
import chaiLike from "chai-like";
import { ReplayProgress, ReplayState } from "./replaystate.ts";

use(chaiLike);

const steps: readonly Step[] = [
  { timeStamp: 1001, codePoint: /* "a" */ 0x0061, timeToType: 100, typo: false },
  { timeStamp: 1201, codePoint: /* "b" */ 0x0062, timeToType: 100, typo: false },
  { timeStamp: 1401, codePoint: /* "c" */ 0x0063, timeToType: 100, typo: false },
];

const events: readonly AnyEvent[] = [
  { timeStamp: 1000, type: "keydown", code: "KeyA", key: "a", modifiers: [] },
  { timeStamp: 1001, type: "input", inputType: "appendChar", codePoint: /* "a" */ 0x0061, timeToType: 100 },
  { timeStamp: 1100, type: "keyup", code: "KeyA", key: "a", modifiers: [] },
  { timeStamp: 1200, type: "keydown", code: "KeyB", key: "b", modifiers: [] },
  { timeStamp: 1201, type: "input", inputType: "appendChar", codePoint: /* "b" */ 0x0062, timeToType: 100 },
  { timeStamp: 1300, type: "keyup", code: "KeyB", key: "b", modifiers: [] },
  { timeStamp: 1400, type: "keydown", code: "KeyC", key: "c", modifiers: [] },
  { timeStamp: 1401, type: "input", inputType: "appendChar", codePoint: /* "c" */ 0x0063, timeToType: 100 },
];

test("process events", () => {
  Timer.now = () => 10000;
  const stepper = new ReplayState(textInputSettings, steps, events);
  expect(stepper).to.be.like({
    delay: 3000, // Pause at start.
    state: "starting",
    progress: { time: 0, length: 3, progress: 0 },
    depressedKeys: [],
  });

  Timer.now = () => 13000;
  stepper.step(); // Start.
  expect(stepper).to.be.like({
    delay: 0, // Delay to keydown A.
    state: "running",
    progress: { time: 0, length: 3, progress: 0 },
    depressedKeys: [],
  });

  Timer.now = () => 13000;
  stepper.step(); // Keydown A.
  expect(stepper).to.be.like({
    delay: 1, // Delay to input A.
    state: "running",
    progress: { time: 0, length: 3, progress: 0 },
    depressedKeys: ["KeyA"],
  });

  Timer.now = () => 13000;
  stepper.step(); // Input A.
  expect(stepper).to.be.like({
    delay: 100, // Delay to keyup A.
    state: "running",
    progress: { time: 0, length: 3, progress: 1 },
    depressedKeys: ["KeyA"],
  });

  Timer.now = () => 13100;
  stepper.step(); // Keyup A.
  expect(stepper).to.be.like({
    delay: 100, // Delay to keydown B.
    state: "running",
    progress: { time: 100, length: 3, progress: 1 },
    depressedKeys: [],
  });

  stepper.step(); // 13200 - Keydown B.
  stepper.step(); // 13200 - Input B.
  stepper.step(); // 13300 - Keyup B.
  stepper.step(); // 13400 - Keydown C.

  Timer.now = () => 13400;
  stepper.step(); // 13400 - Input C.
  expect(stepper).to.be.like({
    delay: 3000, // Pause at finish.
    state: "finished",
    progress: { time: 400, length: 3, progress: 3 },
    depressedKeys: ["KeyC"],
  });

  Timer.now = () => 20000;
  stepper.step();
  expect(stepper).to.be.like({
    delay: 3000, // Pause at start.
    state: "starting",
    progress: { time: 0, length: 3, progress: 0 },
    depressedKeys: [],
  });

  Timer.now = () => 23000;
  stepper.step();
  expect(stepper).to.be.like({
    delay: 0, // Delay to keydown A.
    state: "running",
    progress: { time: 0, length: 3, progress: 0 },
    depressedKeys: [],
  });
});

test("delay steps", () => {
  Timer.now = () => 0;
  const stepper = new ReplayState(textInputSettings, steps, events);
  assert.strictEqual(stepper.state, "starting");
  assert.strictEqual(stepper.delay, 3000); // Pause at start.

  Timer.now = () => 3000;
  stepper.step(); // Start.
  assert.strictEqual(stepper.state, "running");
  assert.strictEqual(stepper.delay, 0);

  Timer.now = () => 3000;
  stepper.step(); // Keydown A.
  assert.strictEqual(stepper.delay, 1);

  Timer.now = () => 3000;
  stepper.step(); // Input A.
  assert.strictEqual(stepper.delay, 100);

  Timer.now = () => 3099;
  assert.strictEqual(stepper.delay, 1);

  Timer.now = () => 3100;
  assert.strictEqual(stepper.delay, 0);

  Timer.now = () => 3200;
  assert.strictEqual(stepper.delay, 0);
});

test("replay progress", () => {
  Timer.now = () => 10000;
  const progress = new ReplayProgress(steps);
  expect(progress).to.be.like({ time: 0, length: 3, progress: 0, speed: 0 });

  Timer.now = () => 10100;
  progress.bump();
  expect(progress).to.be.like({ time: 0, length: 3, progress: 1, speed: 0 });

  Timer.now = () => 10200;
  progress.bump();
  expect(progress).to.be.like({ time: 200, length: 3, progress: 2, speed: 600 });

  Timer.now = () => 10400;
  progress.bump();
  expect(progress).to.be.like({ time: 400, length: 3, progress: 3, speed: 450 });
});
