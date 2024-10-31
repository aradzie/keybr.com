import { test } from "node:test";
import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { act } from "react";
import { PointersLayer } from "./PointersLayer.tsx";

test("empty", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout"] });

  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[]} />
    </KeyboardContext.Provider>,
  );

  ctx.mock.timers.runAll();
  await act(async () => {});

  assert.strictEqual(r.container.querySelectorAll("circle").length, 0);

  r.unmount();
});

test("unknown", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout"] });

  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[0x0000]} />
    </KeyboardContext.Provider>,
  );

  ctx.mock.timers.runAll();
  await act(async () => {});

  assert.strictEqual(r.container.querySelectorAll("circle").length, 0);

  r.unmount();
});

test("without modifiers", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout"] });

  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[/* "a" */ 0x0061]} />
    </KeyboardContext.Provider>,
  );

  ctx.mock.timers.runAll();
  await act(async () => {});

  assert.strictEqual(r.container.querySelectorAll("circle").length, 1);

  r.unmount();
});

test("with modifiers", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout"] });

  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[/* "A" */ 0x0041]} />
    </KeyboardContext.Provider>,
  );

  ctx.mock.timers.runAll();
  await act(async () => {});

  assert.strictEqual(r.container.querySelectorAll("circle").length, 2);

  r.unmount();
});
