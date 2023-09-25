import { type Result, ResultFaker } from "@keybr/result";
import test from "ava";
import { FakeResultStorage } from "./storage.ts";

test("store results", async (t) => {
  const faker = new ResultFaker();
  const r0 = faker.nextResult();
  const r1 = faker.nextResult();

  const results: Result[] = [];

  const storage = new FakeResultStorage(results);

  // Initial.

  t.deepEqual(await storage.load(), []);

  // Append r0.

  await storage.append([r0]);
  t.deepEqual(results, [r0]);
  t.deepEqual(await storage.load(), [r0]);

  // Append r1.

  await storage.append([r1]);
  t.deepEqual(results, [r0, r1]);
  t.deepEqual(await storage.load(), [r0, r1]);

  // Clear.

  await storage.clear();
  t.deepEqual(results, []);
  t.deepEqual(await storage.load(), []);
});
