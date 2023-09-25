import test from "ava";
import { UserIdRange } from "./userid-range.ts";

test("sort and merge intervals", (t) => {
  t.deepEqual([...new UserIdRange([])], []);
  t.deepEqual([...new UserIdRange([{ from: 1, to: 1 }])], [1]);
  t.deepEqual([...new UserIdRange([{ from: 1, to: 3 }])], [1, 2, 3]);
  t.deepEqual(
    [
      ...new UserIdRange([
        { from: 3, to: 3 },
        { from: 2, to: 2 },
        { from: 1, to: 1 },
      ]),
    ],
    [1, 2, 3],
  );
  t.deepEqual(
    [
      ...new UserIdRange([
        { from: 2, to: 3 },
        { from: 1, to: 2 },
      ]),
    ],
    [1, 2, 3],
  );
  t.deepEqual(
    [
      ...new UserIdRange([
        { from: 1, to: 1 },
        { from: 3, to: 3 },
      ]),
    ],
    [1, 3],
  );
});
