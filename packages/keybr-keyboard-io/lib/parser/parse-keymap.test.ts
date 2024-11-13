import { deepStrictEqual } from "node:assert";
import { test } from "node:test";
import { KeyCharacters } from "@keybr/keyboard";
import { parseKeymap } from "./parse-keymap.ts";

test("parse empty", () => {
  const { layout, warnings } = parseKeymap("{}");
  deepStrictEqual([...layout], []);
  deepStrictEqual(warnings, []);
});

test("parse string", () => {
  const { layout, warnings } = parseKeymap(JSON.stringify({ KeyA: "aA" }));
  deepStrictEqual(
    [...layout],
    [new KeyCharacters("KeyA", /* "a" */ 0x0061, /* "A" */ 0x0041, null, null)],
  );
  deepStrictEqual(warnings, []);
});

test("parse array of strings", () => {
  const { layout, warnings } = parseKeymap(
    JSON.stringify({ KeyA: ["a", "A", "", 0x0000] }),
  );
  deepStrictEqual(
    [...layout],
    [new KeyCharacters("KeyA", /* "a" */ 0x0061, /* "A" */ 0x0041, null, null)],
  );
  deepStrictEqual(warnings, []);
});

test("parse array with dead keys", () => {
  const { layout, warnings } = parseKeymap(
    JSON.stringify({ KeyA: ["*`", "*´", "", 0x0000] }),
  );
  deepStrictEqual(
    [...layout],
    [
      new KeyCharacters(
        "KeyA",
        { dead: /* COMBINING GRAVE ACCENT */ 0x0300 },
        { dead: /* COMBINING ACUTE ACCENT */ 0x0301 },
        null,
        null,
      ),
    ],
  );
  deepStrictEqual(warnings, []);
});

test("parse array of empty characters", () => {
  const { layout, warnings } = parseKeymap(
    JSON.stringify({ KeyA: ["", "", 0x0000, null] }),
  );
  deepStrictEqual([...layout], []);
  deepStrictEqual(warnings, ["Key has no characters: KeyA"]);
});

test("ignore invalid characters", () => {
  const { layout, warnings } = parseKeymap(JSON.stringify({ KeyA: [true] }));
  deepStrictEqual([...layout], []);
  deepStrictEqual(warnings, [
    "[KeyA] Invalid character: true",
    "Key has no characters: KeyA",
  ]);
});

test("ignore invalid character lists", () => {
  const { layout, warnings } = parseKeymap(JSON.stringify({ KeyA: true }));
  deepStrictEqual([...layout], []);
  deepStrictEqual(warnings, [
    "[KeyA] Invalid character list: true",
    "Key has no characters: KeyA",
  ]);
});

test("ignore unknown keys", () => {
  const { layout, warnings } = parseKeymap(JSON.stringify({ XYZ: "aA" }));
  deepStrictEqual([...layout], []);
  deepStrictEqual(warnings, ["Unknown key: XYZ"]);
});
