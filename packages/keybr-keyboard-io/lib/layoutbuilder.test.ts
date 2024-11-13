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

  builder.setCharacter("KeyA", KeyModifier.None, 0x0061);
  deepStrictEqual(
    [...builder],
    [new KeyCharacters("KeyA", 0x0061, null, null, null)],
  );
  deepStrictEqual(builder.dict(), { KeyA: [0x0061, null, null, null] });
  deepStrictEqual(builder.toJSON(), { KeyA: "a" });

  builder.setCharacter("KeyA", KeyModifier.Alt, { dead: 0x0300 });
  deepStrictEqual(
    [...builder],
    [new KeyCharacters("KeyA", 0x0061, null, { dead: 0x0300 }, null)],
  );
  deepStrictEqual(builder.dict(), {
    KeyA: [0x0061, null, { dead: 0x0300 }, null],
  });
  deepStrictEqual(builder.toJSON(), { KeyA: ["a", null, { dead: 0x0300 }] });
});

test("format and parse JSON", () => {
  const builder = new LayoutBuilder();
  builder.setCharacter("KeyA", KeyModifier.None, 0x0061);
  builder.setCharacter("KeyA", KeyModifier.Alt, { dead: 0x0300 });

  const { layout, warnings } = parseKeymap(JSON.stringify(builder.toJSON()));
  deepStrictEqual([...layout], [...builder]);
  deepStrictEqual(warnings, []);
});
