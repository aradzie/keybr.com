import { LocalDate, ResultFaker, Today } from "@keybr/result";
import { Settings } from "@keybr/settings";
import test from "ava";
import { MutableDailyGoal } from "./dailygoal.ts";
import { lessonProps } from "./settings.ts";

test("daily goal is not set", (t) => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const faker = new ResultFaker({ timeStamp: today.timeStamp });
  const dailyGoal = new MutableDailyGoal(
    new Settings().set(lessonProps.dailyGoal, 0),
    new Today(today),
  );

  // Assert.

  t.deepEqual(dailyGoal.copy(), { goal: 0, value: 0 });

  // Act.

  dailyGoal.append(faker.nextResult({ time: 60000 }));
  dailyGoal.append(faker.nextResult({ time: 60000 }));

  // Assert.

  t.deepEqual(dailyGoal.copy(), { goal: 0, value: 0 });
});

test("daily goal is set", (t) => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const faker = new ResultFaker({ timeStamp: today.timeStamp });
  const dailyGoal = new MutableDailyGoal(
    new Settings().set(lessonProps.dailyGoal, 10),
    new Today(today),
  );

  // Act, Assert.

  dailyGoal.append(faker.nextResult({ time: 60000, timeStamp: 0 }));
  t.deepEqual(dailyGoal.copy(), { goal: 10, value: 0 });

  // Act, Assert.

  dailyGoal.append(faker.nextResult({ time: 60000 }));
  t.deepEqual(dailyGoal.copy(), { goal: 10, value: 0.1 });

  // Act, Assert.

  dailyGoal.append(faker.nextResult({ time: 60000 }));
  t.deepEqual(dailyGoal.copy(), { goal: 10, value: 0.2 });

  // Act, Assert.

  dailyGoal.append(
    faker.nextResult({
      time: 60000,
      timeStamp: today.plusDays(1).timeStamp,
    }),
  );
  t.deepEqual(dailyGoal.copy(), { goal: 10, value: 0.2 });
});
