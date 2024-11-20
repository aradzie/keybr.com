import { test } from "node:test";
import { deepEqual } from "rich-assert";
import { UserIdRange } from "./userid-range.ts";

test("sort and merge intervals", () => {
  deepEqual([...new UserIdRange([])], []);
  deepEqual([...new UserIdRange([{ from: 1, to: 1 }])], [1]);
  deepEqual([...new UserIdRange([{ from: 1, to: 3 }])], [1, 2, 3]);
  deepEqual(
    [
      ...new UserIdRange([
        { from: 3, to: 3 },
        { from: 2, to: 2 },
        { from: 1, to: 1 },
      ]),
    ],
    [1, 2, 3],
  );
  deepEqual(
    [
      ...new UserIdRange([
        { from: 2, to: 3 },
        { from: 1, to: 2 },
      ]),
    ],
    [1, 2, 3],
  );
  deepEqual(
    [
      ...new UserIdRange([
        { from: 1, to: 1 },
        { from: 3, to: 3 },
      ]),
    ],
    [1, 3],
  );
});
