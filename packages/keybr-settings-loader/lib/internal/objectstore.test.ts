import { test } from "node:test";
import { assert } from "chai";
import { ObjectStorage } from "./objectstore.ts";

test.beforeEach(() => {
  localStorage.clear();
});

test.afterEach(() => {
  localStorage.clear();
});

test("set to local storage", () => {
  const storage = new ObjectStorage();

  // Initial value.
  assert.strictEqual(storage.get("key"), null);
  assert.deepStrictEqual([...storage], []);

  // Put garbage.
  localStorage.setItem("key", "garbage");
  assert.strictEqual(storage.get("key"), null);
  assert.deepStrictEqual([...storage], ["key"]);

  // Put valid JSON.
  localStorage.setItem("key", '"value"');
  assert.strictEqual(storage.get("key"), "value");
  assert.deepStrictEqual([...storage], ["key"]);
});

test("set to object storage", () => {
  const storage = new ObjectStorage();

  // Initial value.
  assert.strictEqual(localStorage.getItem("key"), null);
  assert.strictEqual(localStorage.length, 0);

  // Put something.
  storage.set("key", "value");
  assert.strictEqual(localStorage.getItem("key"), '"value"');
  assert.strictEqual(localStorage.length, 1);

  // Put null.
  storage.set("key", null);
  assert.strictEqual(localStorage.getItem("key"), null);
  assert.strictEqual(localStorage.length, 0);
});
