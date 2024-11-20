import { test } from "node:test";
import { deepEqual, equal, isFalse, isTrue, throws } from "rich-assert";
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

  throws(() => new Enum(new Subject("a"), new Subject("a")));

  const a = new Subject("a");
  const b = new Subject("b");
  const c = new Subject("c");
  const x = new Subject("x");

  const items = new Enum(a, b, c);

  deepEqual([...items], [a, b, c]);
  equal(items.size, 3);
  equal(items.indexOf(a), 0);
  equal(items.indexOf(b), 1);
  equal(items.indexOf(c), 2);
  equal(items.indexOf(x), -1);
  isTrue(items.has(a));
  isTrue(items.has(b));
  isTrue(items.has(c));
  isFalse(items.has(x));
  equal(items.at(0), a);
  equal(items.at(1), b);
  equal(items.at(2), c);
  throws(() => items.at(-1));
  throws(() => items.at(3));
  throws(() => items.at(0.1));
  equal(items.get("a"), a);
  equal(items.get("b"), b);
  equal(items.get("x", c), c);
  throws(() => {
    items.get("x");
  });
  deepEqual(
    items.map(({ id }) => id),
    ["a", "b", "c"],
  );
  deepEqual(
    items.filter(({ id }) => id === "a"),
    [a],
  );
  equal(
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

  throws(() => new XEnum(new Subject("a", 1), new Subject("a", 2)));
  throws(() => new XEnum(new Subject("a", 1), new Subject("b", 1)));

  const a = new Subject("a", 1);
  const b = new Subject("b", 2);
  const c = new Subject("c", 3);
  const x = new Subject("x", 255);

  const items = new XEnum(a, b, c);

  deepEqual([...items], [a, b, c]);
  equal(items.size, 3);
  equal(items.indexOf(a), 0);
  equal(items.indexOf(b), 1);
  equal(items.indexOf(c), 2);
  equal(items.indexOf(x), -1);
  isTrue(items.has(a));
  isTrue(items.has(b));
  isTrue(items.has(c));
  isFalse(items.has(x));
  equal(items.at(0), a);
  equal(items.at(1), b);
  equal(items.at(2), c);
  throws(() => items.at(-1));
  throws(() => items.at(3));
  throws(() => items.at(0.1));
  equal(items.get("a"), a);
  equal(items.get("b"), b);
  equal(items.get("x", c), c);
  throws(() => {
    items.get("x");
  });
  equal(items.xget(1), a);
  equal(items.xget(2), b);
  equal(items.xget(3, c), c);
  throws(() => {
    items.xget(0);
  });
  deepEqual(
    items.map(({ id }) => id),
    ["a", "b", "c"],
  );
  deepEqual(
    items.filter(({ id }) => id === "a"),
    [a],
  );
  equal(
    items.find(({ id }) => id === "a"),
    a,
  );
});
