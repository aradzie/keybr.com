import { Geometry, Layout, loadKeyboard } from "@keybr/keyboard";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { VirtualKeyboard } from "./VirtualKeyboard.tsx";

test("render standard 101", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US, Geometry.ANSI_101);

  const renderer = TestRenderer.create(<VirtualKeyboard keyboard={keyboard} />);

  t.snapshot(renderer.toJSON());
});

test("render standard 101 full", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US, Geometry.ANSI_101_FULL);

  const renderer = TestRenderer.create(<VirtualKeyboard keyboard={keyboard} />);

  t.snapshot(renderer.toJSON());
});
