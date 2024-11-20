import { test } from "node:test";
import { deepEqual, equal } from "rich-assert";
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
  equal(storage.get("key"), null);
  deepEqual([...storage], []);

  // Put garbage.
  localStorage.setItem("key", "garbage");
  equal(storage.get("key"), null);
  deepEqual([...storage], ["key"]);

  // Put valid JSON.
  localStorage.setItem("key", '"value"');
  equal(storage.get("key"), "value");
  deepEqual([...storage], ["key"]);
});

test("set to object storage", () => {
  const storage = new ObjectStorage();

  // Initial value.
  equal(localStorage.getItem("key"), null);
  equal(localStorage.length, 0);

  // Put something.
  storage.set("key", "value");
  equal(localStorage.getItem("key"), '"value"');
  equal(localStorage.length, 1);

  // Put null.
  storage.set("key", null);
  equal(localStorage.getItem("key"), null);
  equal(localStorage.length, 0);
});
