import { ResultFaker } from "@keybr/result";
import { Settings } from "@keybr/settings";
import test from "ava";
import { makeDailyGoal } from "./dailygoal.ts";
import { lessonProps } from "./settings.ts";

test("daily goal", (t) => {
  function settings(time: number) {
    return new Settings().set(lessonProps.dailyGoal, time);
  }

  const faker = new ResultFaker();
  const r1 = faker.nextResult({ time: 60000 });
  const r2 = faker.nextResult({ time: 60000 });

  t.deepEqual(makeDailyGoal(settings(0), []), {
    goal: 0,
    value: 0,
  });
  t.deepEqual(makeDailyGoal(settings(0), [r1]), {
    goal: 0,
    value: 0,
  });
  t.deepEqual(makeDailyGoal(settings(10), []), {
    goal: 10,
    value: 0,
  });
  t.deepEqual(makeDailyGoal(settings(10), [r1]), {
    goal: 10,
    value: 0.1,
  });
  t.deepEqual(makeDailyGoal(settings(10), [r1, r2]), {
    goal: 10,
    value: 0.2,
  });
  t.deepEqual(makeDailyGoal(settings(1), [r1, r2]), {
    goal: 1,
    value: 2,
  });
});
