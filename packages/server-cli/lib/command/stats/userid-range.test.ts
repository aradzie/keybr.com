import { test } from "node:test";
import { assert } from "chai";
import { UserIdRange } from "./userid-range.ts";

test("sort and merge intervals", () => {
  assert.deepStrictEqual([...new UserIdRange([])], []);
  assert.deepStrictEqual([...new UserIdRange([{ from: 1, to: 1 }])], [1]);
  assert.deepStrictEqual([...new UserIdRange([{ from: 1, to: 3 }])], [1, 2, 3]);
  assert.deepStrictEqual(
    [
      ...new UserIdRange([
        { from: 3, to: 3 },
        { from: 2, to: 2 },
        { from: 1, to: 1 },
      ]),
    ],
    [1, 2, 3],
  );
  assert.deepStrictEqual(
    [
      ...new UserIdRange([
        { from: 2, to: 3 },
        { from: 1, to: 2 },
      ]),
    ],
    [1, 2, 3],
  );
  assert.deepStrictEqual(
    [
      ...new UserIdRange([
        { from: 1, to: 1 },
        { from: 3, to: 3 },
      ]),
    ],
    [1, 3],
  );
});
