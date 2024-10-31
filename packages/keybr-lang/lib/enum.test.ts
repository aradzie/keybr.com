import { test } from "node:test";
import { assert } from "chai";
import { Enum, type EnumItem, XEnum, type XEnumItem } from "./enum.ts";

test("enum", () => {
  class Subject implements EnumItem {
    constructor(readonly id: string) {}
    toString() {
      return this.id;
    }
    toJSON() {
      return this.id;
    }
  }

  assert.throws(() => new Enum(new Subject("a"), new Subject("a")));

  const a = new Subject("a");
  const b = new Subject("b");
  const c = new Subject("c");
  const x = new Subject("x");

  const items = new Enum(a, b, c);

  assert.deepStrictEqual([...items], [a, b, c]);
  assert.strictEqual(items.size, 3);
  assert.strictEqual(items.indexOf(a), 0);
  assert.strictEqual(items.indexOf(b), 1);
  assert.strictEqual(items.indexOf(c), 2);
  assert.strictEqual(items.indexOf(x), -1);
  assert.isTrue(items.has(a));
  assert.isTrue(items.has(b));
  assert.isTrue(items.has(c));
  assert.isFalse(items.has(x));
  assert.strictEqual(items.at(0), a);
  assert.strictEqual(items.at(1), b);
  assert.strictEqual(items.at(2), c);
  assert.throws(() => items.at(-1));
  assert.throws(() => items.at(3));
  assert.throws(() => items.at(0.1));
  assert.strictEqual(items.get("a"), a);
  assert.strictEqual(items.get("b"), b);
  assert.strictEqual(items.get("x", c), c);
  assert.throws(() => {
    items.get("x");
  });
  assert.deepStrictEqual(
    items.map(({ id }) => id),
    ["a", "b", "c"],
  );
  assert.deepStrictEqual(
    items.filter(({ id }) => id === "a"),
    [a],
  );
  assert.strictEqual(
    items.find(({ id }) => id === "a"),
    a,
  );
});

test("xenum", () => {
  class Subject implements XEnumItem {
    constructor(
      readonly id: string,
      readonly xid: number,
    ) {}
    toString() {
      return this.id;
    }
    toJSON() {
      return this.id;
    }
  }

  assert.throws(() => new XEnum(new Subject("a", 1), new Subject("a", 2)));
  assert.throws(() => new XEnum(new Subject("a", 1), new Subject("b", 1)));

  const a = new Subject("a", 1);
  const b = new Subject("b", 2);
  const c = new Subject("c", 3);
  const x = new Subject("x", 255);

  const items = new XEnum(a, b, c);

  assert.deepStrictEqual([...items], [a, b, c]);
  assert.strictEqual(items.size, 3);
  assert.strictEqual(items.indexOf(a), 0);
  assert.strictEqual(items.indexOf(b), 1);
  assert.strictEqual(items.indexOf(c), 2);
  assert.strictEqual(items.indexOf(x), -1);
  assert.isTrue(items.has(a));
  assert.isTrue(items.has(b));
  assert.isTrue(items.has(c));
  assert.isFalse(items.has(x));
  assert.strictEqual(items.at(0), a);
  assert.strictEqual(items.at(1), b);
  assert.strictEqual(items.at(2), c);
  assert.throws(() => items.at(-1));
  assert.throws(() => items.at(3));
  assert.throws(() => items.at(0.1));
  assert.strictEqual(items.get("a"), a);
  assert.strictEqual(items.get("b"), b);
  assert.strictEqual(items.get("x", c), c);
  assert.throws(() => {
    items.get("x");
  });
  assert.strictEqual(items.xget(1), a);
  assert.strictEqual(items.xget(2), b);
  assert.strictEqual(items.xget(3, c), c);
  assert.throws(() => {
    items.xget(0);
  });
  assert.deepStrictEqual(
    items.map(({ id }) => id),
    ["a", "b", "c"],
  );
  assert.deepStrictEqual(
    items.filter(({ id }) => id === "a"),
    [a],
  );
  assert.strictEqual(
    items.find(({ id }) => id === "a"),
    a,
  );
});
