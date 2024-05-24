import test from "ava";
import { schedule } from "./scheduler.ts";

test("schedule", async (t) => {
  let done = false;

  const generate = async function* () {
    yield null;
    yield null;
    yield null;
    done = true;
  };

  t.is(await schedule(generate()), undefined);

  t.true(done);
});

test("schedule with a custom delay", async (t) => {
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

  t.is(await schedule(generate(), { delayer }), undefined);

  t.true(done);
});

test("abort", async (t) => {
  let done = false;

  const controller = new AbortController();
  const { signal } = controller;

  const generate = async function* () {
    yield null;
    controller.abort();
    yield null;
    done = true;
  };

  t.is(await schedule(generate(), { signal }), undefined);

  t.false(done);
});

test("fail", async (t) => {
  const error = new Error("fail");

  const fail = async function* () {
    yield null;
    yield null;
    yield null;
    throw error;
  };

  await t.throwsAsync(
    async () => {
      await schedule(fail());
    },
    { is: error },
  );
});
