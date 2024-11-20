import { test } from "node:test";
import { KeyCharacters } from "@keybr/keyboard";
import { deepEqual, isNotNull, isNull } from "rich-assert";
import { importLayout } from "./import.ts";

test("import invalid data", async () => {
  isNull(await importLayout(Buffer.from("abc")));
});

test("import valid data", async () => {
  const result = await importLayout(Buffer.from(`{"KeyA":"aA","XYZ":"xyz"}`));
  isNotNull(result);
  deepEqual(
    [...result.layout],
    [new KeyCharacters("KeyA", /* "a" */ 0x0061, /* "A" */ 0x0041, null, null)],
  );
  deepEqual(result.warnings, ["Unknown key: XYZ"]);
});
