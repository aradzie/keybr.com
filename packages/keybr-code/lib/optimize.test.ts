import test from "ava";
import { optimize } from "./optimize.ts";

test("flatten seqs", (t) => {
  t.deepEqual(
    optimize({
      start: {
        seq: [
          "a",
          "b",
          { seq: ["c", "d", { f: 0.5, opt: { seq: ["e", "f"] } }, "g", "h"] },
        ],
      },
    }),
    {
      start: {
        seq: ["abcd", { f: 0.5, opt: "ef" }, "gh"],
      },
    },
  );
});

test("flatten alts", (t) => {
  t.deepEqual(
    optimize({
      start: {
        alt: [
          "a",
          "b",
          { alt: ["c", "d", { f: 0.5, opt: { alt: ["e", "f"] } }, "g", "h"] },
        ],
      },
    }),
    {
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
  );
});

test("flatten trivial nested seqs and alts", (t) => {
  t.deepEqual(
    optimize({
      start: {
        seq: [{ alt: [{ seq: [{ alt: [{ ref: "a" }] }] }] }],
      },
    }),
    {
      start: { ref: "a" },
    },
  );
});

test("remove empty seqs and alts", (t) => {
  t.deepEqual(
    optimize({
      start: {
        seq: [
          { seq: [{ seq: [] }] },
          { seq: [] },
          { alt: [{ alt: [] }] },
          { alt: [] },
        ],
      },
    }),
    {
      start: {
        seq: [],
      },
    },
  );
});
