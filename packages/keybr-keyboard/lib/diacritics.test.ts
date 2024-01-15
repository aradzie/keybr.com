import test from "ava";
import { combineDiacritic, getDiacritic, isDiacritic } from "./diacritics.ts";

test("get diacritic", (t) => {
  t.false(isDiacritic(/* "a" */ 0x0061));
  t.is(getDiacritic(/* "a" */ 0x0061), null);

  t.false(isDiacritic(/* non-combining acute accent */ 0x00b4));
  t.is(getDiacritic(/* non-combining acute accent */ 0x00b4), null);

  t.true(isDiacritic(/* combining acute accent */ 0x0301));
  t.deepEqual(getDiacritic(/* combining acute accent */ 0x0301), {
    name: "ACUTE ACCENT",
    codePoint: 0x0301,
    baseSet: "ACEGIKLMNOPRSUWYZacegiklmnoprsuwyzΑΕΗΙΟΥΩαεηιουω",
    precomposedSet: "ÁĆÉǴÍḰĹḾŃÓṔŔŚÚẂÝŹáćéǵíḱĺḿńóṕŕśúẃýźΆΈΉΊΌΎΏάέήίόύώ",
  });
});

test("combine diacritic", (t) => {
  t.is(
    combineDiacritic(/* "A" */ 0x0041, /* non-combining acute accent */ 0x00b4),
    /* "A" */ 0x0041,
  );
  t.is(
    combineDiacritic(/* "a" */ 0x0061, /* non-combining acute accent */ 0x00b4),
    /* "a" */ 0x0061,
  );
  t.is(
    combineDiacritic(/* "B" */ 0x0042, /* combining acute accent */ 0x0301),
    /* "B" */ 0x0042,
  );
  t.is(
    combineDiacritic(/* "b" */ 0x0062, /* combining acute accent */ 0x0301),
    /* "b" */ 0x0062,
  );
  t.is(
    combineDiacritic(/* "A" */ 0x0041, /* combining acute accent */ 0x0301),
    /* "Á" */ 0x00c1,
  );
  t.is(
    combineDiacritic(/* "a" */ 0x0061, /* combining acute accent */ 0x0301),
    /* "á" */ 0x00e1,
  );
});
