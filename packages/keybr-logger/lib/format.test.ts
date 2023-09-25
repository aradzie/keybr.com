import test from "ava";
import { format } from "./format.ts";
import { Level } from "./level.ts";

test("make message", (t) => {
  const now = new Date("2001-02-03T04:05:06Z");
  const err = new Error();

  t.deepEqual(format(Level.INFO, now, ["format"]), {
    level: Level.INFO,
    time: now,
    err: null,
    format: "format",
    args: [],
  });
  t.deepEqual(format(Level.INFO, now, ["format", "a", "b", "c"]), {
    level: Level.INFO,
    time: now,
    err: null,
    format: "format",
    args: ["a", "b", "c"],
  });
  t.deepEqual(format(Level.INFO, now, [err, "format"]), {
    level: Level.INFO,
    time: now,
    err,
    format: "format",
    args: [],
  });
  t.deepEqual(format(Level.INFO, now, [err, "format", "a", "b", "c"]), {
    level: Level.INFO,
    time: now,
    err,
    format: "format",
    args: ["a", "b", "c"],
  });
});
