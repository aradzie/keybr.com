import { test } from "node:test";
import { KeyCharacters } from "@keybr/keyboard";
import { assert } from "chai";
import { importLayout } from "./import.ts";

test("import invalid data", async () => {
  assert.isNull(await importLayout(Buffer.from("abc")));
});

test("import valid data", async () => {
  const result = await importLayout(Buffer.from(`{"KeyA":"aA","XYZ":"xyz"}`));
  assert.isNotNull(result);
  assert.deepStrictEqual(
    [...result.layout],
    [new KeyCharacters("KeyA", /* "a" */ 0x0061, /* "A" */ 0x0041, null, null)],
  );
  assert.deepStrictEqual(result.warnings, ["Unknown key: XYZ"]);
});
