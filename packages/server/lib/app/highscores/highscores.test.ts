import { mock } from "node:test";
import { Application } from "@fastr/core";
import { HighScoresFactory } from "@keybr/highscores";
import { ResultFaker } from "@keybr/result";
import { kMain } from "../module.ts";
import { test } from "../test/context.ts";
import { startApp } from "../test/request.ts";

const now = new Date("2001-02-03T04:05:06Z");

mock.timers.enable({ apis: ["Date"], now });

const faker = new ResultFaker({ timeStamp: now.getTime() });

test("get empty high scores entries", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request.GET("/_/high-scores").send();

  // Assert.

  t.is(response.status, 200);
  t.deepEqual(await response.body.json(), []);
});

test("get populated high scores entries", async (t) => {
  // Arrange.

  await t.context.get(HighScoresFactory).append(1, [faker.nextResult()]);
  await t.context.get(HighScoresFactory).append(999, [faker.nextResult()]);

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request.GET("/_/high-scores").send();

  // Assert.

  t.is(response.status, 200);
  t.deepEqual(await response.body.json(), [
    {
      layout: "en-us",
      score: 2400,
      speed: 120,
      user: null,
    },
    {
      layout: "en-us",
      score: 2400,
      speed: 120,
      user: {
        id: "55vdtk1",
        imageUrl: "imageUrl1",
        name: "externalName1",
        premium: false,
      },
    },
  ]);
});
