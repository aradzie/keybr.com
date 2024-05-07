import test from "ava";
import { combineDiacritic, isDiacritic, stripDiacritic } from "./diacritics.ts";

test("classify", (t) => {
  t.false(isDiacritic(/* "a" */ 0x0061));
  t.false(isDiacritic(/* ACUTE ACCENT */ 0x00b4));
  t.true(isDiacritic(/* COMBINING ACUTE ACCENT */ 0x0301));
});

test("combine diacritic", (t) => {
  t.is(
    combineDiacritic(/* "A" */ 0x0041, /* ACUTE ACCENT */ 0x00b4),
    /* "A" */ 0x0041,
  );
  t.is(
    combineDiacritic(/* "a" */ 0x0061, /* ACUTE ACCENT */ 0x00b4),
    /* "a" */ 0x0061,
  );
  t.is(
    combineDiacritic(/* "B" */ 0x0042, /* COMBINING ACUTE ACCENT */ 0x0301),
    /* "B" */ 0x0042,
  );
  t.is(
    combineDiacritic(/* "b" */ 0x0062, /* COMBINING ACUTE ACCENT */ 0x0301),
    /* "b" */ 0x0062,
  );
  t.is(
    combineDiacritic(/* "A" */ 0x0041, /* COMBINING ACUTE ACCENT */ 0x0301),
    /* "Á" */ 0x00c1,
  );
  t.is(
    combineDiacritic(/* "a" */ 0x0061, /* COMBINING ACUTE ACCENT */ 0x0301),
    /* "á" */ 0x00e1,
  );
});

test("strip diacritic", (t) => {
  t.is(stripDiacritic(/* "A" */ 0x0041), /* "A" */ 0x0041);
  t.is(stripDiacritic(/* "a" */ 0x0061), /* "a" */ 0x0061);
  t.is(stripDiacritic(/* "Á" */ 0x00c1), /* "A" */ 0x0041);
  t.is(stripDiacritic(/* "á" */ 0x00e1), /* "a" */ 0x0061);
});
