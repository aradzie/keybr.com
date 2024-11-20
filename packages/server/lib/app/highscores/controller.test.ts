import { test } from "node:test";
import { Application } from "@fastr/core";
import { HighScoresFactory } from "@keybr/highscores";
import { ResultFaker } from "@keybr/result";
import { deepEqual, equal } from "rich-assert";
import { kMain } from "../module.ts";
import { TestContext } from "../test/context.ts";
import { startApp } from "../test/request.ts";

const now = new Date("2001-02-03T04:05:06Z");

const context = new TestContext();

const faker = new ResultFaker({ timeStamp: now.getTime() });

test("get empty high scores entries", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request.GET("/_/high-scores").send();

  // Assert.

  equal(response.status, 200);
  deepEqual(await response.body.json(), []);
});

test("get populated high scores entries", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  await context.get(HighScoresFactory).append(1, [faker.nextResult()]);
  await context.get(HighScoresFactory).append(999, [faker.nextResult()]);

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request.GET("/_/high-scores").send();

  // Assert.

  equal(response.status, 200);
  deepEqual(await response.body.json(), [
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
