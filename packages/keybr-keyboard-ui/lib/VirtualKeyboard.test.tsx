import { loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { VirtualKeyboard } from "./VirtualKeyboard.tsx";

test("render compact", (t) => {
  const keyboard = loadKeyboard(Layout.getDefault(), { full: false });

  const testRenderer = TestRenderer.create(
    <VirtualKeyboard keyboard={keyboard} />,
  );

  t.snapshot(testRenderer.toJSON());
});

test("render full", (t) => {
  const keyboard = loadKeyboard(Layout.getDefault(), { full: true });

  const testRenderer = TestRenderer.create(
    <VirtualKeyboard keyboard={keyboard} />,
  );

  t.snapshot(testRenderer.toJSON());
});
