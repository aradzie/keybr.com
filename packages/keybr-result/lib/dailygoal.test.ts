import test from "ava";
import { computeDailyGoal } from "./dailygoal.ts";
import { ResultFaker } from "./fake.tsx";

test("daily goal", (t) => {
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ time: 60000 });
  const r2 = faker.nextResult({ time: 60000 });

  t.deepEqual(computeDailyGoal([], 0), {
    value: 0,
    goal: 0,
  });
  t.deepEqual(computeDailyGoal([r1], 0), {
    value: 0,
    goal: 0,
  });
  t.deepEqual(computeDailyGoal([], 10), {
    value: 0,
    goal: 10,
  });
  t.deepEqual(computeDailyGoal([r1], 10), {
    value: 0.1,
    goal: 10,
  });
  t.deepEqual(computeDailyGoal([r1, r2], 10), {
    value: 0.2,
    goal: 10,
  });
  t.deepEqual(computeDailyGoal([r1, r2], 1), {
    value: 2,
    goal: 1,
  });
});
