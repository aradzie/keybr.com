import { test } from "node:test";
import { equal, isFalse, isTrue } from "rich-assert";
import { Tasks } from "./tasks.ts";

test("delayed", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout", "setInterval"] });

  const tasks = new Tasks();

  let count = 0;
  const t = tasks.delayed(100, () => {
    count += 1;
  });

  equal(tasks.pending, 1);
  isFalse(t.fired);
  isFalse(t.cancelled);
  equal(count, 0);

  ctx.mock.timers.runAll();
  equal(tasks.pending, 0);
  isTrue(t.fired);
  isFalse(t.cancelled);
  equal(count, 1);

  ctx.mock.timers.runAll();
  equal(tasks.pending, 0);
  isTrue(t.fired);
  isFalse(t.cancelled);
  equal(count, 1);
});

test("cancel delayed", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout", "setInterval"] });

  const tasks = new Tasks();

  let count = 0;
  const t = tasks.delayed(100, () => {
    count += 1;
  });

  equal(tasks.pending, 1);
  isFalse(t.fired);
  isFalse(t.cancelled);
  equal(count, 0);

  t.cancel();
  t.cancel();
  t.cancel();
  equal(tasks.pending, 0);

  ctx.mock.timers.runAll();
  equal(tasks.pending, 0);
  isFalse(t.fired);
  isTrue(t.cancelled);
  equal(count, 0);

  ctx.mock.timers.runAll();
  equal(tasks.pending, 0);
  isFalse(t.fired);
  isTrue(t.cancelled);
  equal(count, 0);
});

test("repeated", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout", "setInterval"] });

  const tasks = new Tasks();

  let count = 0;
  const t = tasks.repeated(100, () => {
    count += 1;
  });

  equal(tasks.pending, 1);
  isFalse(t.fired);
  isFalse(t.cancelled);
  equal(count, 0);

  ctx.mock.timers.runAll();
  equal(tasks.pending, 1);
  isTrue(t.fired);
  isFalse(t.cancelled);
  equal(count, 1);

  ctx.mock.timers.runAll();
  equal(tasks.pending, 1);
  isTrue(t.fired);
  isFalse(t.cancelled);
  equal(count, 2);
});

test("cancel repeated", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout", "setInterval"] });

  const tasks = new Tasks();

  let count = 0;
  const t = tasks.repeated(100, () => {
    count += 1;
  });

  equal(tasks.pending, 1);
  isFalse(t.fired);
  isFalse(t.cancelled);
  equal(count, 0);

  t.cancel();
  t.cancel();
  t.cancel();
  equal(tasks.pending, 0);

  ctx.mock.timers.runAll();
  equal(tasks.pending, 0);
  isFalse(t.fired);
  isTrue(t.cancelled);
  equal(count, 0);

  ctx.mock.timers.runAll();
  equal(tasks.pending, 0);
  isFalse(t.fired);
  isTrue(t.cancelled);
  equal(count, 0);
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

  equal(tasks.pending, 2);

  tasks.cancelAll();
  equal(tasks.pending, 0);

  tasks.cancelAll();
  equal(tasks.pending, 0);

  ctx.mock.timers.runAll();
  equal(tasks.pending, 0);
});
