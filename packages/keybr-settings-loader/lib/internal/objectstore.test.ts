import test from "ava";
import { ObjectStorage } from "./objectstore.ts";

test.beforeEach(() => {
  localStorage.clear();
});

test.afterEach(() => {
  localStorage.clear();
});

test.serial("set to local storage", (t) => {
  const storage = new ObjectStorage();

  // Initial value.
  t.is(storage.get("key"), null);
  t.deepEqual([...storage], []);

  // Put garbage.
  localStorage.setItem("key", "garbage");
  t.is(storage.get("key"), null);
  t.deepEqual([...storage], ["key"]);

  // Put valid JSON.
  localStorage.setItem("key", '"value"');
  t.is(storage.get("key"), "value");
  t.deepEqual([...storage], ["key"]);
});

test.serial("set to object storage", (t) => {
  const storage = new ObjectStorage();

  // Initial value.
  t.is(localStorage.getItem("key"), null);
  t.is(localStorage.length, 0);

  // Put something.
  storage.set("key", "value");
  t.is(localStorage.getItem("key"), '"value"');
  t.is(localStorage.length, 1);

  // Put null.
  storage.set("key", null);
  t.is(localStorage.getItem("key"), null);
  t.is(localStorage.length, 0);
});
