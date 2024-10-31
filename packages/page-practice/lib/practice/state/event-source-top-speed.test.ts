import { test } from "node:test";
import { ResultFaker } from "@keybr/result";
import { assert } from "chai";
import { TopSpeedEvents } from "./event-source-top-speed.ts";
import { type LessonEvent } from "./event-types.ts";

test("generate events", () => {
  // Arrange.

  const faker = new ResultFaker();
  const source = new TopSpeedEvents();
  const events = new Set<LessonEvent>();
  const listener = events.add.bind(events);

  // Act.

  source.append(faker.nextResult({ time: 50000 }), listener);
  source.append(faker.nextResult({ time: 50000 }), listener);
  source.append(faker.nextResult({ time: 50000 }), listener);

  // Assert.

  assert.deepStrictEqual([...events], []);
  events.clear();

  // Act.

  source.append(faker.nextResult({ time: 40000 }), listener);

  // Assert.

  assert.deepStrictEqual(
    [...events],
    [{ type: "top-speed", speed: 150, previous: 120 }],
  );
  events.clear();

  // Act.

  source.append(faker.nextResult({ time: 50000 }), listener);
  source.append(faker.nextResult({ time: 40000 }), listener);

  // Assert.

  assert.deepStrictEqual([...events], []);

  // Act.

  source.append(faker.nextResult({ time: 30000 }), listener);

  // Assert.

  assert.deepStrictEqual(
    [...events],
    [{ type: "top-speed", speed: 200, previous: 150 }],
  );
  events.clear();
});
