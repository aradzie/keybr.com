import { test } from "node:test";
import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { fake } from "@keybr/test-env-time";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { act } from "react";
import { PointersLayer } from "./PointersLayer.tsx";

test.beforeEach(() => {
  fake.timers.set();
});

test.afterEach(() => {
  fake.timers.reset();
});

test("empty", async () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[]} />
    </KeyboardContext.Provider>,
  );

  await act(async () => {});
  await fake.timers.run();

  assert.strictEqual(r.container.querySelectorAll("circle").length, 0);

  r.unmount();
});

test("unknown", async () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[0x0000]} />
    </KeyboardContext.Provider>,
  );

  await act(async () => {});
  await fake.timers.run();

  assert.strictEqual(r.container.querySelectorAll("circle").length, 0);

  r.unmount();
});

test("without modifiers", async () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[/* "a" */ 0x0061]} />
    </KeyboardContext.Provider>,
  );

  await fake.timers.run();
  await act(async () => {});

  assert.strictEqual(r.container.querySelectorAll("circle").length, 1);

  r.unmount();
});

test("with modifiers", async () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[/* "A" */ 0x0041]} />
    </KeyboardContext.Provider>,
  );

  await fake.timers.run();
  await act(async () => {});

  assert.strictEqual(r.container.querySelectorAll("circle").length, 2);

  r.unmount();
});
