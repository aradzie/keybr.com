import { test } from "node:test";
import { KeyCharacters, Layout, loadKeyboard } from "@keybr/keyboard";
import { deepEqual } from "rich-assert";
import { LayoutBuilder } from "../layoutbuilder.ts";
import { parseKeymap } from "./parse-keymap.ts";

test("parse empty", () => {
  const { layout, warnings } = parseKeymap("{}");
  deepEqual([...layout], []);
  deepEqual(warnings, []);
});

test("parse string", () => {
  const { layout, warnings } = parseKeymap(JSON.stringify({ KeyA: "aA" }));
  deepEqual(
    [...layout],
    [
      new KeyCharacters(
        "KeyA", //
        /* "a" */ 0x0061,
        /* "A" */ 0x0041,
        null,
        null,
      ),
    ],
  );
  deepEqual(warnings, []);
});

test("parse array of strings", () => {
  const { layout, warnings } = parseKeymap(
    JSON.stringify({ KeyA: ["a", "A", "", 0x0000] }),
  );
  deepEqual(
    [...layout],
    [
      new KeyCharacters(
        "KeyA", //
        /* "a" */ 0x0061,
        /* "A" */ 0x0041,
        null,
        null,
      ),
    ],
  );
  deepEqual(warnings, []);
});

test("parse array with dead keys", () => {
  const { layout, warnings } = parseKeymap(
    JSON.stringify({ KeyA: ["*`", "*´", "**", "*!"] }),
  );
  deepEqual(
    [...layout],
    [
      new KeyCharacters(
        "KeyA", //
        { dead: /* COMBINING GRAVE ACCENT */ 0x0300 },
        { dead: /* COMBINING ACUTE ACCENT */ 0x0301 },
        { dead: /* "*" */ 0x002a },
        null,
      ),
    ],
  );
  deepEqual(warnings, ["[KeyA] Invalid dead character: U+0021"]);
});

test("parse array of empty characters", () => {
  const { layout, warnings } = parseKeymap(
    JSON.stringify({ KeyA: ["", "", 0x0000, null] }),
  );
  deepEqual([...layout], []);
  deepEqual(warnings, []);
});

test("ignore invalid characters", () => {
  const { layout, warnings } = parseKeymap(JSON.stringify({ KeyA: [true] }));
  deepEqual([...layout], []);
  deepEqual(warnings, ["[KeyA] Invalid character: true"]);
});

test("ignore invalid character lists", () => {
  const { layout, warnings } = parseKeymap(JSON.stringify({ KeyA: true }));
  deepEqual([...layout], []);
  deepEqual(warnings, ["[KeyA] Invalid character list: true"]);
});

test("ignore unknown keys", () => {
  const { layout, warnings } = parseKeymap(JSON.stringify({ XYZ: "aA" }));
  deepEqual([...layout], []);
  deepEqual(warnings, ["Unknown key: XYZ"]);
});

test("export and import all layouts", () => {
  for (const id of Layout.ALL) {
    const builder = LayoutBuilder.from(loadKeyboard(id).characterDict);
    const { layout, warnings } = parseKeymap(JSON.stringify(builder.toJSON()));
    deepEqual([...layout], [...builder]);
    deepEqual(warnings, []);
  }
});
