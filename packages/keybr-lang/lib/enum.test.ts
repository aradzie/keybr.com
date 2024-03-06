import test from "ava";
import { Enum, type EnumItem, XEnum, type XEnumItem } from "./enum.ts";

test("enum", (t) => {
  class Subject implements EnumItem {
    constructor(readonly id: string) {}
    toString() {
      return this.id;
    }
    toJSON() {
      return this.id;
    }
  }

  t.throws(() => new Enum(new Subject("a"), new Subject("a")));

  const a = new Subject("a");
  const b = new Subject("b");
  const c = new Subject("c");
  const x = new Subject("x");

  const items = new Enum(a, b, c);

  t.deepEqual([...items], [a, b, c]);
  t.is(items.size, 3);
  t.is(items.indexOf(a), 0);
  t.is(items.indexOf(b), 1);
  t.is(items.indexOf(c), 2);
  t.is(items.indexOf(x), -1);
  t.true(items.has(a));
  t.true(items.has(b));
  t.true(items.has(c));
  t.false(items.has(x));
  t.is(items.at(0), a);
  t.is(items.at(1), b);
  t.is(items.at(2), c);
  t.throws(() => items.at(-1));
  t.throws(() => items.at(3));
  t.throws(() => items.at(0.1));
  t.is(items.get("a"), a);
  t.is(items.get("b"), b);
  t.is(items.get("x", c), c);
  t.throws(() => {
    items.get("x");
  });
  t.deepEqual(
    items.map(({ id }) => id),
    ["a", "b", "c"],
  );
  t.deepEqual(
    items.filter(({ id }) => id === "a"),
    [a],
  );
  t.is(
    items.find(({ id }) => id === "a"),
    a,
  );
});

test("xenum", (t) => {
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

  t.throws(() => new XEnum(new Subject("a", 1), new Subject("a", 2)));
  t.throws(() => new XEnum(new Subject("a", 1), new Subject("b", 1)));

  const a = new Subject("a", 1);
  const b = new Subject("b", 2);
  const c = new Subject("c", 3);
  const x = new Subject("x", 255);

  const items = new XEnum(a, b, c);

  t.deepEqual([...items], [a, b, c]);
  t.is(items.size, 3);
  t.is(items.indexOf(a), 0);
  t.is(items.indexOf(b), 1);
  t.is(items.indexOf(c), 2);
  t.is(items.indexOf(x), -1);
  t.true(items.has(a));
  t.true(items.has(b));
  t.true(items.has(c));
  t.false(items.has(x));
  t.is(items.at(0), a);
  t.is(items.at(1), b);
  t.is(items.at(2), c);
  t.throws(() => items.at(-1));
  t.throws(() => items.at(3));
  t.throws(() => items.at(0.1));
  t.is(items.get("a"), a);
  t.is(items.get("b"), b);
  t.is(items.get("x", c), c);
  t.throws(() => {
    items.get("x");
  });
  t.is(items.xget(1), a);
  t.is(items.xget(2), b);
  t.is(items.xget(3, c), c);
  t.throws(() => {
    items.xget(0);
  });
  t.deepEqual(
    items.map(({ id }) => id),
    ["a", "b", "c"],
  );
  t.deepEqual(
    items.filter(({ id }) => id === "a"),
    [a],
  );
  t.is(
    items.find(({ id }) => id === "a"),
    a,
  );
});
