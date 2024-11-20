import { test } from "node:test";
import { equal, isFalse, isTrue, rejects } from "rich-assert";
import { schedule } from "./scheduler.ts";

test("schedule", async () => {
  let done = false;

  const generate = async function* () {
    yield null;
    yield null;
    yield null;
    done = true;
  };

  equal(await schedule(generate()), undefined);

  isTrue(done);
});

test("schedule with a custom delay", async () => {
  let done = false;

  const generate = async function* () {
    for (let i = 0; i < 100; i++) {
      yield null;
    }
    done = true;
  };

  const delayer = (cb: () => void) => {
    process.nextTick(cb);
  };

  equal(await schedule(generate(), { delayer }), undefined);

  isTrue(done);
});

test("abort", async () => {
  let done = false;

  const controller = new AbortController();
  const { signal } = controller;

  const generate = async function* () {
    yield null;
    controller.abort();
    yield null;
    done = true;
  };

  equal(await schedule(generate(), { signal }), undefined);

  isFalse(done);
});

test("fail", async () => {
  const error = new Error("fail");

  const fail = async function* () {
    yield null;
    yield null;
    yield null;
    throw error;
  };

  await rejects(schedule(fail()), error);
});
