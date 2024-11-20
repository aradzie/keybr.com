import { test } from "node:test";
import { ResultFaker } from "@keybr/result";
import { deepEqual } from "rich-assert";
import { PersistentResultStorage } from "./local.ts";

test("update local storage", async () => {
  const storage = new PersistentResultStorage();

  const faker = new ResultFaker();
  const r1 = faker.nextResult();
  const r2 = faker.nextResult();
  const r3 = faker.nextResult();

  // Read from the empty storage.
  deepEqual(await storage.load(), []);

  // Add some data to the storage.
  await storage.append([r1, r2, r3]);

  // Read from the non-empty storage.
  deepEqual(await storage.load(), [r1, r2, r3]);

  // Clear the storage.
  await storage.clear();

  // Read from the empty storage.
  deepEqual(await storage.load(), []);
});
