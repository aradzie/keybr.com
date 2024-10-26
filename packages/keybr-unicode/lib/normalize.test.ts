import test from "ava";
import { expand, replace } from "./normalize.ts";

test("expand", (t) => {
  t.is(expand(/* "A" */ 0x0041), null);
  t.deepEqual(expand(/* "À" */ 0x00c0), [/* "A" */ 0x0041]);
  t.deepEqual(
    expand(/* HORIZONTAL ELLIPSIS */ 0x2026),
    [/* "." */ 0x002e, /* "." */ 0x002e, /* "." */ 0x002e],
  );
});

test("replace", (t) => {
  t.is(replace(/* HYPHEN-MINUS */ 0x002d), null);
  t.is(replace(/* HYPHEN */ 0x2010), /* HYPHEN-MINUS */ 0x002d);
  t.is(replace(/* NON-BREAKING HYPHEN */ 0x2011), /* HYPHEN-MINUS */ 0x002d);
});
