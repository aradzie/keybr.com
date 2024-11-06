import { test } from "node:test";
import { assert } from "chai";
import { Tasks } from "./tasks.ts";

test("delayed", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout", "setInterval"] });

  const tasks = new Tasks();

  let count = 0;
  const t = tasks.delayed(100, () => {
    count += 1;
  });

  assert.strictEqual(tasks.pending, 1);
  assert.isFalse(t.fired);
  assert.isFalse(t.cancelled);
  assert.strictEqual(count, 0);

  ctx.mock.timers.runAll();
  assert.strictEqual(tasks.pending, 0);
  assert.isTrue(t.fired);
  assert.isFalse(t.cancelled);
  assert.strictEqual(count, 1);

  ctx.mock.timers.runAll();
  assert.strictEqual(tasks.pending, 0);
  assert.isTrue(t.fired);
  assert.isFalse(t.cancelled);
  assert.strictEqual(count, 1);
});

test("cancel delayed", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout", "setInterval"] });

  const tasks = new Tasks();

  let count = 0;
  const t = tasks.delayed(100, () => {
    count += 1;
  });

  assert.strictEqual(tasks.pending, 1);
  assert.isFalse(t.fired);
  assert.isFalse(t.cancelled);
  assert.strictEqual(count, 0);

  t.cancel();
  t.cancel();
  t.cancel();
  assert.strictEqual(tasks.pending, 0);

  ctx.mock.timers.runAll();
  assert.strictEqual(tasks.pending, 0);
  assert.isFalse(t.fired);
  assert.isTrue(t.cancelled);
  assert.strictEqual(count, 0);

  ctx.mock.timers.runAll();
  assert.strictEqual(tasks.pending, 0);
  assert.isFalse(t.fired);
  assert.isTrue(t.cancelled);
  assert.strictEqual(count, 0);
});

test("repeated", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout", "setInterval"] });

  const tasks = new Tasks();

  let count = 0;
  const t = tasks.repeated(100, () => {
    count += 1;
  });

  assert.strictEqual(tasks.pending, 1);
  assert.isFalse(t.fired);
  assert.isFalse(t.cancelled);
  assert.strictEqual(count, 0);

  ctx.mock.timers.runAll();
  assert.strictEqual(tasks.pending, 1);
  assert.isTrue(t.fired);
  assert.isFalse(t.cancelled);
  assert.strictEqual(count, 1);

  ctx.mock.timers.runAll();
  assert.strictEqual(tasks.pending, 1);
  assert.isTrue(t.fired);
  assert.isFalse(t.cancelled);
  assert.strictEqual(count, 2);
});

test("cancel repeated", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout", "setInterval"] });

  const tasks = new Tasks();

  let count = 0;
  const t = tasks.repeated(100, () => {
    count += 1;
  });

  assert.strictEqual(tasks.pending, 1);
  assert.isFalse(t.fired);
  assert.isFalse(t.cancelled);
  assert.strictEqual(count, 0);

  t.cancel();
  t.cancel();
  t.cancel();
  assert.strictEqual(tasks.pending, 0);

  ctx.mock.timers.runAll();
  assert.strictEqual(tasks.pending, 0);
  assert.isFalse(t.fired);
  assert.isTrue(t.cancelled);
  assert.strictEqual(count, 0);

  ctx.mock.timers.runAll();
  assert.strictEqual(tasks.pending, 0);
  assert.isFalse(t.fired);
  assert.isTrue(t.cancelled);
  assert.strictEqual(count, 0);
});

test("cancel all", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout", "setInterval"] });

  const tasks = new Tasks();

  tasks.delayed(100, () => {
    throw new Error();
  });
  tasks.repeated(100, () => {
    throw new Error();
  });

  assert.strictEqual(tasks.pending, 2);

  tasks.cancelAll();
  assert.strictEqual(tasks.pending, 0);

  tasks.cancelAll();
  assert.strictEqual(tasks.pending, 0);

  ctx.mock.timers.runAll();
  assert.strictEqual(tasks.pending, 0);
});
