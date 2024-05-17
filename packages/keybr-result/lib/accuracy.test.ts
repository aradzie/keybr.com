import test from "ava";
import { MutableStreakList, type Streak } from "./accuracy.ts";

test("find accuracy streaks, increasing", (t) => {
  // Arrange.

  const faker = makeResultFaker();
  const accept = makeAccept();
  const list = new MutableStreakList();

  // Assert the initial state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [] },
      { level: 0.97, results: [] },
      { level: 0.95, results: [] },
    ],
  );
  t.deepEqual(accept.take(), []);

  // Append some results.

  const r1 = faker(0.95);
  const r2 = faker(0.95);
  list.append(r1, accept);
  list.append(r2, accept);

  // Assert the updated state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [] },
      { level: 0.97, results: [] },
      { level: 0.95, results: [r1, r2] },
    ],
  );
  t.deepEqual(accept.take(), []);

  // Append some results.

  const r3 = faker(0.97);
  const r4 = faker(0.97);
  list.append(r3, accept);
  list.append(r4, accept);

  // Assert the updated state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [] },
      { level: 0.97, results: [r3, r4] },
      { level: 0.95, results: [r1, r2, r3, r4] },
    ],
  );
  t.deepEqual(accept.take(), []);

  // Append some results.

  const r5 = faker(1.0);
  const r6 = faker(1.0);
  list.append(r5, accept);
  list.append(r6, accept);

  // Assert the updated state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [r5, r6] },
      { level: 0.97, results: [r3, r4, r5, r6] },
      { level: 0.95, results: [r1, r2, r3, r4, r5, r6] },
    ],
  );
  t.deepEqual(accept.take(), []);

  // Append some results.

  const r7 = faker(0.1);
  const r8 = faker(0.1);
  list.append(r7, accept);
  list.append(r8, accept);

  // Assert the updated state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [] },
      { level: 0.97, results: [] },
      { level: 0.95, results: [] },
    ],
  );
  t.deepEqual(accept.take(), [
    { level: 1.0, results: [r5, r6] },
    { level: 0.97, results: [r3, r4, r5, r6] },
    { level: 0.95, results: [r1, r2, r3, r4, r5, r6] },
  ]);
});

test("find accuracy streaks, decreasing", (t) => {
  // Arrange.

  const faker = makeResultFaker();
  const accept = makeAccept();
  const list = new MutableStreakList();

  // Assert the initial state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [] },
      { level: 0.97, results: [] },
      { level: 0.95, results: [] },
    ],
  );
  t.deepEqual(accept.take(), []);

  // Append some results.

  const r1 = faker(1.0);
  const r2 = faker(1.0);
  list.append(r1, accept);
  list.append(r2, accept);

  // Assert the updated state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [r1, r2] },
      { level: 0.97, results: [] },
      { level: 0.95, results: [] },
    ],
  );
  t.deepEqual(accept.take(), []);

  // Append some results.

  const r3 = faker(0.97);
  const r4 = faker(0.97);
  list.append(r3, accept);
  list.append(r4, accept);

  // Assert the updated state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [] },
      { level: 0.97, results: [r1, r2, r3, r4] },
      { level: 0.95, results: [] },
    ],
  );
  t.deepEqual(accept.take(), [{ level: 1.0, results: [r1, r2] }]);

  // Append some results.

  const r5 = faker(0.95);
  const r6 = faker(0.95);
  list.append(r5, accept);
  list.append(r6, accept);

  // Assert the updated state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [] },
      { level: 0.97, results: [] },
      { level: 0.95, results: [r1, r2, r3, r4, r5, r6] },
    ],
  );
  t.deepEqual(accept.take(), [{ level: 0.97, results: [r1, r2, r3, r4] }]);

  // Append some results.

  const r7 = faker(0.1);
  const r8 = faker(0.1);
  list.append(r7, accept);
  list.append(r8, accept);

  // Assert the updated state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [] },
      { level: 0.97, results: [] },
      { level: 0.95, results: [] },
    ],
  );
  t.deepEqual(accept.take(), [
    { level: 0.95, results: [r1, r2, r3, r4, r5, r6] },
  ]);
});

test("find accuracy streaks, mixed", (t) => {
  // Arrange.

  const faker = makeResultFaker();
  const accept = makeAccept();
  const list = new MutableStreakList();

  // Assert the initial state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [] },
      { level: 0.97, results: [] },
      { level: 0.95, results: [] },
    ],
  );
  t.deepEqual(accept.take(), []);

  // Append some results.

  const r1 = faker(0.97);
  const r2 = faker(0.97);
  list.append(r1, accept);
  list.append(r2, accept);

  // Assert the updated state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [] },
      { level: 0.97, results: [r1, r2] },
      { level: 0.95, results: [] },
    ],
  );
  t.deepEqual(accept.take(), []);

  // Append some results.

  const r3 = faker(1.0);
  const r4 = faker(1.0);
  list.append(r3, accept);
  list.append(r4, accept);

  // Assert the updated state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [r3, r4] },
      { level: 0.97, results: [r1, r2, r3, r4] },
      { level: 0.95, results: [] },
    ],
  );
  t.deepEqual(accept.take(), []);

  // Append some results.

  const r5 = faker(0.95);
  const r6 = faker(0.95);
  list.append(r5, accept);
  list.append(r6, accept);

  // Assert the updated state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [] },
      { level: 0.97, results: [] },
      { level: 0.95, results: [r1, r2, r3, r4, r5, r6] },
    ],
  );
  t.deepEqual(accept.take(), [
    { level: 1.0, results: [r3, r4] },
    { level: 0.97, results: [r1, r2, r3, r4] },
  ]);

  // Append some results.

  const r7 = faker(0.1);
  const r8 = faker(0.1);
  list.append(r7, accept);
  list.append(r8, accept);

  // Assert the updated state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [] },
      { level: 0.97, results: [] },
      { level: 0.95, results: [] },
    ],
  );
  t.deepEqual(accept.take(), [
    { level: 0.95, results: [r1, r2, r3, r4, r5, r6] },
  ]);
});

test("end accuracy streaks", (t) => {
  // Arrange.

  const faker = makeResultFaker();
  const accept = makeAccept();
  const list = new MutableStreakList();

  const r1 = faker(0.95);
  const r2 = faker(0.95);
  const r3 = faker(0.97);
  const r4 = faker(0.97);
  const r5 = faker(1.0);
  const r6 = faker(1.0);

  list.append(r1, accept);
  list.append(r2, accept);
  list.append(r3, accept);
  list.append(r4, accept);
  list.append(r5, accept);
  list.append(r6, accept);

  // Assert the initial state.

  t.deepEqual(
    [...list.copy()],
    [
      { level: 1.0, results: [r5, r6] },
      { level: 0.97, results: [r3, r4, r5, r6] },
      { level: 0.95, results: [r1, r2, r3, r4, r5, r6] },
    ],
  );
  t.deepEqual(accept.take(), []);

  // Act.

  list.end(accept);

  // Assert the updated state.

  t.deepEqual(accept.take(), [
    { level: 1.0, results: [r5, r6] },
    { level: 0.97, results: [r3, r4, r5, r6] },
    { level: 0.95, results: [r1, r2, r3, r4, r5, r6] },
  ]);
});

test("find longest streaks, no streaks", (t) => {
  // Arrange.

  const faker = makeResultFaker();
  const r1 = faker(0.1);
  const r2 = faker(0.1);
  const r3 = faker(0.1);

  // Assert.

  t.deepEqual(MutableStreakList.findLongest([]), []);
  t.deepEqual(MutableStreakList.findLongest([r1, r2, r3]), []);
});

test("find longest streaks, one streak", (t) => {
  // Arrange.

  const faker = makeResultFaker();
  const r1 = faker(0.1);
  const r2 = faker(0.97);
  const r3 = faker(0.1);

  // Assert.

  t.deepEqual(MutableStreakList.findLongest([r1, r2, r3]), [
    { level: 0.97, results: [r2] },
  ]);
});

test("find longest streaks, two streaks", (t) => {
  // Arrange.

  const faker = makeResultFaker();
  const r1 = faker(0.97);
  const r2 = faker(1.0);

  t.deepEqual(MutableStreakList.findLongest([r1, r2]), [
    { level: 1.0, results: [r2] },
    { level: 0.97, results: [r1, r2] },
  ]);
});

test("find longest streaks, mixed", (t) => {
  // Arrange.

  const faker = makeResultFaker();
  const r1 = faker(1.0);
  const r2 = faker(1.0);
  const r3 = faker(0.1);
  const r4 = faker(1.0);

  // Assert.

  t.deepEqual(MutableStreakList.findLongest([r1, r2, r3, r4]), [
    { level: 1.0, results: [r1, r2] },
    { level: 0.97, results: [r4] },
  ]);
});

const makeResultFaker = () => {
  let sequence = 0;
  return (accuracy: number): any => {
    return { id: `r${(sequence += 1)}`, accuracy };
  };
};

const makeAccept = () => {
  const set = new Set<Streak>();
  const accept = (streak: Streak) => {
    set.add(streak);
  };
  accept.take = () => {
    const list = [...set];
    set.clear();
    return list;
  };
  return accept;
};
