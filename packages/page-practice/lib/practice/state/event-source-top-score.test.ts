import { ResultFaker } from "@keybr/result";
import test from "ava";
import { TopScoreEvents } from "./event-source-top-score.ts";
import { type LessonEvent } from "./event-types.ts";

test("generate events", (t) => {
  // Arrange.

  const faker = new ResultFaker();
  const source = new TopScoreEvents();
  const events = new Set<LessonEvent>();
  const listener = events.add.bind(events);

  // Act.

  source.append(faker.nextResult({ time: 50000 }), listener);
  source.append(faker.nextResult({ time: 50000 }), listener);
  source.append(faker.nextResult({ time: 50000 }), listener);

  // Assert.

  t.deepEqual([...events], []);
  events.clear();

  // Act.

  source.append(faker.nextResult({ time: 40000 }), listener);

  // Assert.

  t.deepEqual(
    [...events],
    [{ type: "top-score", score: 3000, previous: 2400 }],
  );
  events.clear();

  // Act.

  source.append(faker.nextResult({ time: 50000 }), listener);
  source.append(faker.nextResult({ time: 40000 }), listener);

  // Assert.

  t.deepEqual([...events], []);
  events.clear();

  // Act.

  source.append(faker.nextResult({ time: 30000 }), listener);

  // Assert.

  t.deepEqual(
    [...events],
    [{ type: "top-score", score: 4000, previous: 3000 }],
  );
  events.clear();
});
