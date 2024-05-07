import { KeyShape, Language } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import test from "ava";
import { makeKeyComponent } from "./Key.tsx";

test.serial("static labels", (t) => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      labels: [{ text: "XYZ", pos: [20, 20], align: ["m", "m"] }],
    },
    null,
  );

  const Key = makeKeyComponent(Language.EN, shape);

  const r = render(<Key />);

  t.is(r.container.textContent, "XYZ");

  r.unmount();
});

test.serial("letter labels", (t) => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    },
    [
      /* Latin Small Letter Dotless I */ 0x0131, //
      /* Latin Capital Letter I */ 0x0049,
      /* Latin Small Letter I */ 0x0069,
      /* Latin Capital Letter I with Dot Above */ 0x0130,
    ],
  );

  const Key = makeKeyComponent(Language.TR, shape);

  const r = render(<Key />);

  t.is(r.container.textContent, "Iİ");

  r.unmount();
});

test.serial("dead labels", (t) => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    },
    [
      { dead: /* COMBINING GRAVE ACCENT */ 0x0300 },
      { dead: /* COMBINING ACUTE ACCENT */ 0x0301 },
      { dead: /* * */ 0x002a },
      { dead: /* * */ 0x002a },
    ],
  );

  const Key = makeKeyComponent(Language.DE, shape);

  const r = render(<Key />);

  t.is(r.container.textContent, "◌̀◌́**");

  r.unmount();
});

test.serial("ligature labels", (t) => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    },
    [
      { ligature: "XX" },
      { ligature: "YY" },
      { ligature: "AA" },
      { ligature: "BB" },
    ],
  );

  const Key = makeKeyComponent(Language.DE, shape);

  const r = render(<Key />);

  t.is(r.container.textContent, "XXYYAABB");

  r.unmount();
});

test.serial("mixed labels", (t) => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    },
    [
      /* a */ 0x0061,
      { dead: /* COMBINING GRAVE ACCENT */ 0x0300 },
      { special: /* ZERO WIDTH JOINER */ 0x200d },
      { ligature: "XX" },
    ],
  );

  const Key = makeKeyComponent(Language.DE, shape);

  const r = render(<Key />);

  t.is(r.container.textContent, "A◌̀XX");

  r.unmount();
});

test.serial("space", (t) => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    },
    [
      /* SPACE */ 0x0020, //
      /* NO-BREAK SPACE */ 0x00a0,
      /* NARROW NO-BREAK SPACE */ 0x202f,
    ],
  );

  const Key = makeKeyComponent(Language.EN, shape);

  const r = render(<Key />);

  t.is(r.container.textContent, "");

  r.unmount();
});
