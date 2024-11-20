import { test } from "node:test";
import { KeyCharacters, KeyModifier } from "@keybr/keyboard";
import { deepEqual } from "rich-assert";
import { LayoutBuilder } from "./layoutbuilder.ts";
import { parseKeymap } from "./parser/index.ts";

test("build", () => {
  const builder = new LayoutBuilder();
  deepEqual([...builder], []);
  deepEqual(builder.dict(), {});
  deepEqual(builder.toJSON(), {});

  builder.setOne("KeyA", KeyModifier.None, 0x0061);
  deepEqual(
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
  deepEqual(builder.dict(), {
    KeyA: [0x0061, null, null, null],
  });
  deepEqual(builder.toJSON(), {
    KeyA: "a",
  });

  builder.setOne("KeyA", KeyModifier.Alt, 0x0300);
  deepEqual(
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
  deepEqual(builder.dict(), {
    KeyA: [0x0061, null, { dead: 0x0300 }, null],
  });
  deepEqual(builder.toJSON(), {
    KeyA: ["a", null, "*`"],
  });

  builder.setOne("KeyA", KeyModifier.Shift, 0x034f);
  deepEqual(
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
  deepEqual(builder.dict(), {
    KeyA: [0x0061, { special: 0x034f }, { dead: 0x0300 }, null],
  });
  deepEqual(builder.toJSON(), {
    KeyA: ["a", 0x034f, "*`"],
  });
});

test("format and parse JSON", () => {
  const builder = new LayoutBuilder();
  builder.setOne("KeyA", KeyModifier.None, 0x0061);
  builder.setOne("KeyA", KeyModifier.Shift, { dead: 0x0300 });
  builder.setOne("KeyA", KeyModifier.Alt, { special: 0x034f });
  builder.setOne("KeyA", KeyModifier.ShiftAlt, { ligature: "?" });

  const { layout, warnings } = parseKeymap(JSON.stringify(builder.toJSON()));
  deepEqual([...layout], [...builder]);
  deepEqual(warnings, []);
});
