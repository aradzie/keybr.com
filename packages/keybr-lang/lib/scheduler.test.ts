import { test } from "node:test";
import { assert, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { schedule } from "./scheduler.ts";

use(chaiAsPromised);

test("schedule", async () => {
  let done = false;

  const generate = async function* () {
    yield null;
    yield null;
    yield null;
    done = true;
  };

  assert.strictEqual(await schedule(generate()), undefined);

  assert.isTrue(done);
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

  assert.strictEqual(await schedule(generate(), { delayer }), undefined);

  assert.isTrue(done);
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

  assert.strictEqual(await schedule(generate(), { signal }), undefined);

  assert.isFalse(done);
});

test("fail", async () => {
  const error = new Error("fail");

  const fail = async function* () {
    yield null;
    yield null;
    yield null;
    throw error;
  };

  await assert.isRejected(schedule(fail()), error);
});
