import { test } from "node:test";
import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { act, render } from "@testing-library/react";
import { equal } from "rich-assert";
import { PointersLayer } from "./PointersLayer.tsx";

test("empty", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout"] });

  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[]} />
    </KeyboardContext.Provider>,
  );

  act(() => {
    ctx.mock.timers.runAll();
  });

  equal(r.container.querySelectorAll("circle").length, 0);

  r.unmount();
});

test("unknown", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout"] });

  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[0x0000]} />
    </KeyboardContext.Provider>,
  );

  act(() => {
    ctx.mock.timers.runAll();
  });

  equal(r.container.querySelectorAll("circle").length, 0);

  r.unmount();
});

test("without modifiers", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout"] });

  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[/* "a" */ 0x0061]} />
    </KeyboardContext.Provider>,
  );

  act(() => {
    ctx.mock.timers.runAll();
  });

  equal(r.container.querySelectorAll("circle").length, 1);

  r.unmount();
});

test("with modifiers", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout"] });

  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[/* "A" */ 0x0041]} />
    </KeyboardContext.Provider>,
  );

  act(() => {
    ctx.mock.timers.runAll();
  });

  equal(r.container.querySelectorAll("circle").length, 2);

  r.unmount();
});
