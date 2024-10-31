import { test } from "node:test";
import { KeyShape, Language } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { makeKeyComponent } from "./Key.tsx";

test("static labels", () => {
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

  assert.strictEqual(r.container.textContent, "XYZ");

  r.unmount();
});

test("letter labels", () => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    },
    [
      /* LATIN SMALL LETTER DOTLESS I */ 0x0131, //
      /* LATIN CAPITAL LETTER I */ 0x0049,
      /* LATIN SMALL LETTER I */ 0x0069,
      /* LATIN CAPITAL LETTER I WITH DOT ABOVE */ 0x0130,
    ],
  );

  const Key = makeKeyComponent(Language.TR, shape);

  const r = render(<Key />);

  assert.strictEqual(r.container.textContent, "Iİ");

  r.unmount();
});

test("dead labels", () => {
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
      { dead: /* "*" */ 0x002a },
      { dead: /* "*" */ 0x002a },
    ],
  );

  const Key = makeKeyComponent(Language.DE, shape);

  const r = render(<Key />);

  assert.strictEqual(r.container.textContent, "◌̀◌́**");

  r.unmount();
});

test("ligature labels", () => {
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

  assert.strictEqual(r.container.textContent, "XXYYAABB");

  r.unmount();
});

test("mixed labels", () => {
  const shape = new KeyShape(
    "my-key",
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    },
    [
      /* "a" */ 0x0061,
      { dead: /* COMBINING GRAVE ACCENT */ 0x0300 },
      { special: /* ZERO WIDTH JOINER */ 0x200d },
      { ligature: "XX" },
    ],
  );

  const Key = makeKeyComponent(Language.DE, shape);

  const r = render(<Key />);

  assert.strictEqual(r.container.textContent, "A◌̀XX");

  r.unmount();
});

test("space", () => {
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

  assert.strictEqual(r.container.textContent, "");

  r.unmount();
});
