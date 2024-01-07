import test from "ava";
import { languages } from "./languages.ts";

test("language configuration", (t) => {
  const idSet = new Set();
  for (const { id, alphabet } of languages) {
    t.false(idSet.has(id));
    idSet.add(id);

    const codePointSet = new Set();
    for (const codePoint of alphabet) {
      t.true(codePoint > 0x0020);
      t.false(codePointSet.has(codePoint));
      codePointSet.add(codePoint);
    }
  }
});
