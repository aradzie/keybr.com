import { test } from "node:test";
import { assert } from "chai";
import { combineDiacritic, isDiacritic, stripDiacritic } from "./diacritics.ts";

test("classify", () => {
  assert.isFalse(isDiacritic(/* "a" */ 0x0061));
  assert.isFalse(isDiacritic(/* ACUTE ACCENT */ 0x00b4));
  assert.isTrue(isDiacritic(/* COMBINING ACUTE ACCENT */ 0x0301));
});

test("combine diacritic", () => {
  assert.strictEqual(
    combineDiacritic(/* "A" */ 0x0041, /* ACUTE ACCENT */ 0x00b4),
    /* "A" */ 0x0041,
  );
  assert.strictEqual(
    combineDiacritic(/* "a" */ 0x0061, /* ACUTE ACCENT */ 0x00b4),
    /* "a" */ 0x0061,
  );
  assert.strictEqual(
    combineDiacritic(/* "B" */ 0x0042, /* COMBINING ACUTE ACCENT */ 0x0301),
    /* "B" */ 0x0042,
  );
  assert.strictEqual(
    combineDiacritic(/* "b" */ 0x0062, /* COMBINING ACUTE ACCENT */ 0x0301),
    /* "b" */ 0x0062,
  );
  assert.strictEqual(
    combineDiacritic(/* "A" */ 0x0041, /* COMBINING ACUTE ACCENT */ 0x0301),
    /* "Á" */ 0x00c1,
  );
  assert.strictEqual(
    combineDiacritic(/* "a" */ 0x0061, /* COMBINING ACUTE ACCENT */ 0x0301),
    /* "á" */ 0x00e1,
  );
});

test("strip diacritic", () => {
  assert.strictEqual(stripDiacritic(/* "A" */ 0x0041), /* "A" */ 0x0041);
  assert.strictEqual(stripDiacritic(/* "a" */ 0x0061), /* "a" */ 0x0061);
  assert.strictEqual(stripDiacritic(/* "Á" */ 0x00c1), /* "A" */ 0x0041);
  assert.strictEqual(stripDiacritic(/* "á" */ 0x00e1), /* "a" */ 0x0061);
});
