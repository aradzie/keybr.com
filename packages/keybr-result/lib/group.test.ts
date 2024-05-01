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
    timeStamp: new LocalDate(2001, 1, 1).timeStamp,
  });
  const r2 = faker.nextResult({
    timeStamp: new LocalDate(2001, 1, 1).timeStamp,
  });
  const r3 = faker.nextResult({
    timeStamp: new LocalDate(2001, 1, 2).timeStamp,
  });
  const r4 = faker.nextResult({
    timeStamp: new LocalDate(2001, 1, 3).timeStamp,
  });

  // Act.

  const map = ResultGroups.byDate([r1, r2, r3, r4]);

  // Assert.

  t.deepEqual(
    [...map.keys()],
    [
      new LocalDate(2001, 1, 1),
      new LocalDate(2001, 1, 2),
      new LocalDate(2001, 1, 3),
    ],
  );

  t.deepEqual(map.get(new LocalDate(2001, 1, 1)), [r1, r2]);
  t.deepEqual(map.get(new LocalDate(2001, 1, 2)), [r3]);
  t.deepEqual(map.get(new LocalDate(2001, 1, 3)), [r4]);
  t.deepEqual(map.get(new LocalDate(2001, 1, 4)), []);
});
