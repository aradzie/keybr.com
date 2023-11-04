import { ResultFaker } from "@keybr/result";
import test from "ava";
import { accuracyStreaks } from "./accuracy.ts";

test("no results", (t) => {
  // Act.

  const streaks = accuracyStreaks([]);

  // Assert.

  t.deepEqual(streaks, []);
});

test("no streaks", (t) => {
  // Arrange.

  const faker = new ResultFaker();
  const r1 = faker.nextResult({ length: 100, errors: 10 });
  const r2 = faker.nextResult({ length: 100, errors: 10 });
  const r3 = faker.nextResult({ length: 100, errors: 10 });

  // Act.

  const streaks = accuracyStreaks([r1, r2, r3]);

  // Assert.

  t.deepEqual(streaks, []);
});

test("one streak, 99%", (t) => {
  // Arrange.

  const faker = new ResultFaker();
  const r1 = faker.nextResult({ length: 100, errors: 10 });
  const r2 = faker.nextResult({ length: 100, errors: 1 });
  const r3 = faker.nextResult({ length: 100, errors: 10 });

  // Act.

  const streaks = accuracyStreaks([r1, r2, r3]);

  // Assert.

  t.deepEqual(streaks, [{ threshold: 0.99, results: [r2], length: 100 }]);
});

test("one streak, 100%", (t) => {
  // Arrange.

  const faker = new ResultFaker();
  const r1 = faker.nextResult({ length: 100, errors: 10 });
  const r2 = faker.nextResult({ length: 100, errors: 0 });
  const r3 = faker.nextResult({ length: 100, errors: 10 });

  // Act.

  const streaks = accuracyStreaks([r1, r2, r3]);

  // Assert.

  t.deepEqual(streaks, [{ threshold: 1.0, results: [r2], length: 100 }]);
});

test("two streaks from start to end", (t) => {
  // Arrange.

  const faker = new ResultFaker();
  const r1 = faker.nextResult({ length: 100, errors: 1 });
  const r2 = faker.nextResult({ length: 100, errors: 0 });

  // Act.

  const streaks = accuracyStreaks([r1, r2]);

  // Assert.

  t.deepEqual(streaks, [
    { threshold: 1.0, results: [r2], length: 100 },
    { threshold: 0.99, results: [r1, r2], length: 200 },
  ]);
});

test("two streaks in the middle", (t) => {
  // Arrange.

  const faker = new ResultFaker();
  const r1 = faker.nextResult({ length: 100, errors: 10 });
  const r2 = faker.nextResult({ length: 100, errors: 1 });
  const r3 = faker.nextResult({ length: 100, errors: 0 });
  const r4 = faker.nextResult({ length: 100, errors: 10 });

  // Act.

  const streaks = accuracyStreaks([r1, r2, r3, r4]);

  // Assert.

  t.deepEqual(streaks, [
    { threshold: 1.0, results: [r3], length: 100 },
    { threshold: 0.99, results: [r2, r3], length: 200 },
  ]);
});

test("find longest streak", (t) => {
  // Arrange.

  const faker = new ResultFaker();
  const r1 = faker.nextResult({ length: 100, errors: 0 });
  const r2 = faker.nextResult({ length: 100, errors: 0 });
  const r3 = faker.nextResult({ length: 100, errors: 10 });
  const r4 = faker.nextResult({ length: 100, errors: 0 });

  // Act.

  const streaks = accuracyStreaks([r1, r2, r3, r4]);

  // Assert.

  t.deepEqual(streaks, [
    { threshold: 1.0, results: [r1, r2], length: 200 },
    { threshold: 0.99, results: [r4], length: 100 },
  ]);
});
