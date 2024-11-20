import { test } from "node:test";
import { type Result, ResultFaker } from "@keybr/result";
import { deepEqual } from "rich-assert";
import { FakeResultStorage } from "./storage.ts";

test("store results", async () => {
  const faker = new ResultFaker();
  const r0 = faker.nextResult();
  const r1 = faker.nextResult();

  const results: Result[] = [];

  const storage = new FakeResultStorage(results);

  // Initial.

  deepEqual(await storage.load(), []);

  // Append r0.

  await storage.append([r0]);
  deepEqual(results, [r0]);
  deepEqual(await storage.load(), [r0]);

  // Append r1.

  await storage.append([r1]);
  deepEqual(results, [r0, r1]);
  deepEqual(await storage.load(), [r0, r1]);

  // Clear.

  await storage.clear();
  deepEqual(results, []);
  deepEqual(await storage.load(), []);
});
