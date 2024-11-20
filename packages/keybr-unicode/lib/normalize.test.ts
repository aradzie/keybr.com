import { test } from "node:test";
import { deepEqual, equal } from "rich-assert";
import { expand, replace } from "./normalize.ts";

test("expand", () => {
  equal(expand(/* "A" */ 0x0041), null);
  deepEqual(expand(/* "À" */ 0x00c0), [/* "A" */ 0x0041]);
  deepEqual(
    expand(/* HORIZONTAL ELLIPSIS */ 0x2026),
    [/* "." */ 0x002e, /* "." */ 0x002e, /* "." */ 0x002e],
  );
});

test("replace", () => {
  equal(replace(/* HYPHEN-MINUS */ 0x002d), null);
  equal(replace(/* HYPHEN */ 0x2010), /* HYPHEN-MINUS */ 0x002d);
  equal(replace(/* NON-BREAKING HYPHEN */ 0x2011), /* HYPHEN-MINUS */ 0x002d);
});
