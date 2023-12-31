import { KeyShape } from "@keybr/keyboard";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { keyTemplate, Symbol } from "./Key.tsx";

test("render", (t) => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      rx: 0,
      ry: 0,
      ra: 0,
      shape: "key",
      finger: "pinky",
    },
    [0x0061, 0x0062, 0x0063, 0x0064],
  );

  const Key = keyTemplate(shape, <Symbol x={15} y={25} text="Label" />);

  const testRenderer = TestRenderer.create(<Key />);

  t.snapshot(testRenderer.toJSON());
});
