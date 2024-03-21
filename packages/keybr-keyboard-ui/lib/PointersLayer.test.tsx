import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { fake } from "@keybr/test-env-time";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { PointersLayer } from "./PointersLayer.tsx";

test.beforeEach(() => {
  fake.timers.set();
});

test.afterEach(() => {
  fake.timers.reset();
});

test.serial("empty", async (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[]} />
    </KeyboardContext.Provider>,
  );

  await TestRenderer.act(() => {});
  await fake.timers.run();

  t.is(renderer.root.findAllByType("circle").length, 0);

  t.snapshot(renderer.toJSON());
});

test.serial("unknown", async (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[0x0000]} />
    </KeyboardContext.Provider>,
  );

  await TestRenderer.act(() => {});
  await fake.timers.run();

  t.is(renderer.root.findAllByType("circle").length, 0);

  t.snapshot(renderer.toJSON());
});

test.serial("without modifiers", async (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[/* "a" */ 0x0061]} />
    </KeyboardContext.Provider>,
  );

  await TestRenderer.act(() => {});
  await fake.timers.run();

  t.is(renderer.root.findAllByType("circle").length, 1);

  t.snapshot(renderer.toJSON());
});

test.serial("with modifiers", async (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <PointersLayer suffix={[/* "A" */ 0x0041]} />
    </KeyboardContext.Provider>,
  );

  await TestRenderer.act(() => {});
  await fake.timers.run();

  t.is(renderer.root.findAllByType("circle").length, 3);

  t.snapshot(renderer.toJSON());
});
