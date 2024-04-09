import { KeyShape, Language } from "@keybr/keyboard";
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

  const Key = makeKeyComponent(Language.EN, shape);

  const renderer = TestRenderer.create(<Key />);

  t.snapshot(renderer.toJSON());
});

test("proper letter labels", (t) => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    },
    [
      /* Latin Small Letter Dotless I */ 0x0131, // Base
      /* Latin Capital Letter I */ 0x0049, // Shift
      /* Latin Small Letter I */ 0x0069, // Alt
      /* Latin Capital Letter I with Dot Above */ 0x0130, // Shift+Alt
    ],
  );

  const Key = makeKeyComponent(Language.TR, shape);

  const renderer = TestRenderer.create(<Key />);

  t.snapshot(renderer.toJSON());
});

test("proper dead labels", (t) => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    },
    [/* GRAVE ACCENT */ 0x0300, 0, /* ACUTE ACCENT */ 0x0301, 0],
  );

  const Key = makeKeyComponent(Language.DE, shape);

  const renderer = TestRenderer.create(<Key />);

  t.snapshot(renderer.toJSON());
});

test("space", (t) => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    },
    [/* SPACE */ 0x0020],
  );

  const Key = makeKeyComponent(Language.EN, shape);

  const renderer = TestRenderer.create(<Key />);

  t.snapshot(renderer.toJSON());
});
