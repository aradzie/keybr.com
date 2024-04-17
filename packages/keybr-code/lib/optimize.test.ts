import test from "ava";
import { optimize } from "./optimize.ts";

test("flatten seqs", (t) => {
  t.deepEqual(
    optimize({
      rule: {
        start: {
          seq: [
            "a",
            "b",
            { seq: ["c", "d", { f: 0.5, opt: { seq: ["e", "f"] } }, "g", "h"] },
          ],
        },
      },
    }),
    {
      rule: {
        start: {
          seq: ["abcd", { f: 0.5, opt: "ef" }, "gh"],
        },
      },
    },
  );
});

test("flatten alts", (t) => {
  t.deepEqual(
    optimize({
      rule: {
        start: {
          alt: [
            "a",
            "b",
            { alt: ["c", "d", { f: 0.5, opt: { alt: ["e", "f"] } }, "g", "h"] },
          ],
        },
      },
    }),
    {
      rule: {
        start: {
          alt: [
            "a",
            "b",
            "c",
            "d",
            { f: 0.5, opt: { alt: ["e", "f"] } },
            "g",
            "h",
          ],
        },
      },
    },
  );
});

test("flatten trivial nested seqs and alts", (t) => {
  t.deepEqual(
    optimize({
      rule: {
        start: {
          seq: [{ alt: [{ seq: [{ alt: [{ ref: "a" }] }] }] }],
        },
      },
    }),
    {
      rule: {
        start: { ref: "a" },
      },
    },
  );
});

test("remove empty seqs and alts", (t) => {
  t.deepEqual(
    optimize({
      rule: {
        start: {
          seq: [
            { seq: [{ seq: [] }] },
            { seq: [] },
            { alt: [{ alt: [] }] },
            { alt: [] },
          ],
        },
      },
    }),
    {
      rule: {
        start: {
          seq: [],
        },
      },
    },
  );
});
