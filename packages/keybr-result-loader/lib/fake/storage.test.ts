import { test } from "node:test";
import { type Result, ResultFaker } from "@keybr/result";
import { assert } from "chai";
import { FakeResultStorage } from "./storage.ts";

test("store results", async () => {
  const faker = new ResultFaker();
  const r0 = faker.nextResult();
  const r1 = faker.nextResult();

  const results: Result[] = [];

  const storage = new FakeResultStorage(results);

  // Initial.

  assert.deepStrictEqual(await storage.load(), []);

  // Append r0.

  await storage.append([r0]);
  assert.deepStrictEqual(results, [r0]);
  assert.deepStrictEqual(await storage.load(), [r0]);

  // Append r1.

  await storage.append([r1]);
  assert.deepStrictEqual(results, [r0, r1]);
  assert.deepStrictEqual(await storage.load(), [r0, r1]);

  // Clear.

  await storage.clear();
  assert.deepStrictEqual(results, []);
  assert.deepStrictEqual(await storage.load(), []);
});
