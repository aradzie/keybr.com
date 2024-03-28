import { KeyShape } from "@keybr/keyboard";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { makeKeyComponent } from "./Key.tsx";

test("render", (t) => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      labels: [{ text: "XYZ", pos: [20, 20], align: ["m", "m"] }],
      zones: ["pinky"],
      homing: true,
    },
    [0x0061, 0x0062, 0x0063, 0x0064],
  );

  const Key = makeKeyComponent(shape);

  const renderer = TestRenderer.create(<Key />);

  t.snapshot(renderer.toJSON());
});
