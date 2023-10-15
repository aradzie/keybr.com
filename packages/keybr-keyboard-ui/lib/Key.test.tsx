import { KeyboardKey } from "@keybr/keyboard";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { Key } from "./Key.tsx";

test("render", (t) => {
  const testRenderer = TestRenderer.create(
    <Key
      keyboardKey={
        new KeyboardKey(
          "my-key",
          { a: 0x0061, b: 0x0062, c: 0x0063, d: 0x0064 },
          {
            x: 0,
            y: 0,
            w: 40,
            h: 40,
            shape: "key",
            zone: null,
            finger: "pinky",
          },
        )
      }
    />,
  );

  t.snapshot(testRenderer.toJSON());
});
