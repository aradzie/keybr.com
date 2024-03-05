import { Layout } from "@keybr/keyboard";
import test from "ava";
import { ResultFaker } from "./fake.tsx";
import { ResultGroups } from "./group.ts";
import { LocalDate } from "./localdate.ts";

test("group results by layout", (t) => {
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ layout: Layout.EN_US });
  const r2 = faker.nextResult({ layout: Layout.DE_DE });

  const map = new ResultGroups(({ layout }) => layout);

  t.deepEqual([...map.keys()], []);
  t.deepEqual([...map], []);

  map.get(Layout.EN_US);

  t.deepEqual([...map.keys()], [Layout.EN_US]);
  t.deepEqual([...map], [{ key: Layout.EN_US, results: [] }]);

  map.add([r1]);

  t.deepEqual([...map.keys()], [Layout.EN_US]);
  t.deepEqual([...map], [{ key: Layout.EN_US, results: [r1] }]);

  map.add([r2]);

  t.deepEqual([...map.keys()], [Layout.EN_US, Layout.DE_DE]);
  t.deepEqual(
    [...map],
    [
      { key: Layout.EN_US, results: [r1] },
      { key: Layout.DE_DE, results: [r2] },
    ],
  );
});

test("group results by date", (t) => {
  // Arrange.

  const faker = new ResultFaker();
  const r1 = faker.nextResult({
    timeStamp: Date.parse("2001-01-01T00:00:00Z"),
  });
  const r2 = faker.nextResult({
    timeStamp: Date.parse("2001-01-01T01:02:03Z"),
  });
  const r3 = faker.nextResult({
    timeStamp: Date.parse("2001-01-02T01:02:03Z"),
  });
  const r4 = faker.nextResult({
    timeStamp: Date.parse("2001-01-03T11:22:33Z"),
  });

  // Act.

  const map = ResultGroups.byDate([r1, r2, r3, r4]);

  // Assert.

  const d0 = new LocalDate(2000, 1, 1);
  const d1 = new LocalDate(2001, 1, 1);
  const d2 = new LocalDate(2001, 1, 2);
  const d3 = new LocalDate(2001, 1, 3);

  t.deepEqual([...map.keys()], [d1, d2, d3]);

  t.deepEqual(map.get(d0), []);
  t.deepEqual(map.get(d1), [r1, r2]);
  t.deepEqual(map.get(d2), [r3]);
  t.deepEqual(map.get(d3), [r4]);
});
