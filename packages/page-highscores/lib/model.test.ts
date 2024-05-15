import { makeKnex } from "@keybr/config";
import { createSchema } from "@keybr/database";
import { clearTables, seedModels } from "@keybr/database/lib/testing/seeds.ts";
import { Layout } from "@keybr/keyboard";
import test from "ava";
import { mapHighScoresEntries } from "./model.ts";

const now = new Date("2001-02-03T04:05:06Z");

test.beforeEach(async () => {
  await createSchema(makeKnex());
  await clearTables();
  await seedModels();
});

test.serial("map entries", async (t) => {
  t.deepEqual(await mapHighScoresEntries([]), []);

  t.deepEqual(
    await mapHighScoresEntries([
      {
        user: 1,
        layout: Layout.EN_US,
        timeStamp: now,
        time: 50000,
        length: 100,
        errors: 1,
        complexity: 20,
        speed: 750,
        score: 1000,
      },
      {
        user: 999,
        layout: Layout.EN_DVORAK,
        timeStamp: now,
        time: 50000,
        length: 100,
        errors: 1,
        complexity: 20,
        speed: 500,
        score: 500,
      },
    ]),
    [
      {
        user: {
          id: "55vdtk1",
          imageUrl: "imageUrl1",
          name: "externalName1",
          premium: false,
        },
        layout: Layout.EN_US,
        speed: 750,
        score: 1000,
      },
      {
        user: {
          id: null,
          imageUrl: null,
          name: "deleted user",
        },
        layout: Layout.EN_DVORAK,
        speed: 500,
        score: 500,
      },
    ],
  );
});
