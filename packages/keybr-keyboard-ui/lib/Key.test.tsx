import { test } from "node:test";
import { KeyShape, Language } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import { equal } from "rich-assert";
import { makeKeyComponent } from "./Key.tsx";

test("static labels", () => {
  // Arrange.

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

  // Act.

  const r = render(<Key />);

  // Assert.

  equal(r.container.textContent, "XYZ");
  equal(r.container.querySelectorAll('[data-key="my-key"]').length, 1);

  r.unmount();
});

test("letter labels", () => {
  // Arrange.

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

  // Act.

  const r = render(<Key />);

  // Assert.

  equal(r.container.textContent, "Iİ");
  equal(r.container.querySelectorAll('[data-key="my-key"]').length, 1);

  r.unmount();
});

test("dead labels", () => {
  // Arrange.

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

  // Act.

  const r = render(<Key />);

  // Assert.

  equal(r.container.textContent, "◌̀◌́**");
  equal(r.container.querySelectorAll('[data-key="my-key"]').length, 1);

  r.unmount();
});

test("ligature labels", () => {
  // Arrange.

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

  // Act.

  const r = render(<Key />);

  // Assert.

  equal(r.container.textContent, "XXYYAABB");
  equal(r.container.querySelectorAll('[data-key="my-key"]').length, 1);

  r.unmount();
});

test("mixed labels", () => {
  // Arrange.

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

  // Act.

  const r = render(<Key />);

  // Assert.

  equal(r.container.textContent, "A◌̀XX");
  equal(r.container.querySelectorAll('[data-key="my-key"]').length, 1);

  r.unmount();
});

test("space", () => {
  // Arrange.

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

  // Act.

  const r = render(<Key />);

  // Assert.

  equal(r.container.textContent, "");
  equal(r.container.querySelectorAll('[data-key="my-key"]').length, 1);

  r.unmount();
});
