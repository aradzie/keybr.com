import { Geometry, Layout, loadKeyboard } from "@keybr/keyboard";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { VirtualKeyboard } from "./VirtualKeyboard.tsx";

test("render standard 101", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US, Geometry.STANDARD_101);

  const testRenderer = TestRenderer.create(
    <VirtualKeyboard keyboard={keyboard} />,
  );

  t.snapshot(testRenderer.toJSON());
});

test("render standard 101 full", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US, Geometry.STANDARD_101_FULL);

  const testRenderer = TestRenderer.create(
    <VirtualKeyboard keyboard={keyboard} />,
  );

  t.snapshot(testRenderer.toJSON());
});
