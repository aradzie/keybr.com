import { deepStrictEqual } from "node:assert";
import { test } from "node:test";
import { KeyCharacters, KeyModifier } from "@keybr/keyboard";
import { LayoutBuilder } from "./layoutbuilder.ts";
import { parseKeymap } from "./parser/index.ts";

test("build", () => {
  const builder = new LayoutBuilder();
  deepStrictEqual([...builder], []);
  deepStrictEqual(builder.dict(), {});
  deepStrictEqual(builder.toJSON(), {});

  builder.setOne("KeyA", KeyModifier.None, 0x0061);
  deepStrictEqual(
    [...builder],
    [
      new KeyCharacters(
        "KeyA", //
        0x0061,
        null,
        null,
        null,
      ),
    ],
  );
  deepStrictEqual(builder.dict(), {
    KeyA: [0x0061, null, null, null],
  });
  deepStrictEqual(builder.toJSON(), {
    KeyA: "a",
  });

  builder.setOne("KeyA", KeyModifier.Alt, 0x0300);
  deepStrictEqual(
    [...builder],
    [
      new KeyCharacters(
        "KeyA", //
        0x0061,
        null,
        { dead: 0x0300 },
        null,
      ),
    ],
  );
  deepStrictEqual(builder.dict(), {
    KeyA: [0x0061, null, { dead: 0x0300 }, null],
  });
  deepStrictEqual(builder.toJSON(), {
    KeyA: ["a", null, 0x0300],
  });

  builder.setOne("KeyA", KeyModifier.Shift, 0x034f);
  deepStrictEqual(
    [...builder],
    [
      new KeyCharacters(
        "KeyA",
        0x0061,
        { special: 0x034f },
        { dead: 0x0300 },
        null,
      ),
    ],
  );
  deepStrictEqual(builder.dict(), {
    KeyA: [0x0061, { special: 0x034f }, { dead: 0x0300 }, null],
  });
  deepStrictEqual(builder.toJSON(), {
    KeyA: ["a", 0x034f, 0x0300],
  });
});

test("format and parse JSON", () => {
  const builder = new LayoutBuilder();
  builder.setOne("KeyA", KeyModifier.None, 0x0061);
  builder.setOne("KeyA", KeyModifier.Shift, { dead: 0x0300 });
  builder.setOne("KeyA", KeyModifier.Alt, { special: 0x034f });
  builder.setOne("KeyA", KeyModifier.ShiftAlt, { ligature: "?" });

  const { layout, warnings } = parseKeymap(JSON.stringify(builder.toJSON()));
  deepStrictEqual([...layout], [...builder]);
  deepStrictEqual(warnings, []);
});
