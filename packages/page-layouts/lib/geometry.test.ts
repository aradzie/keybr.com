import test from "ava";
import {
  bottomRowKeys,
  digitRowKeys,
  homeRowKeys,
  leftHandKeys,
  rightHandKeys,
  topRowKeys,
} from "./geometry.ts";

test("geometry", (t) => {
  t.deepEqual(
    [...digitRowKeys, ...topRowKeys, ...homeRowKeys, ...bottomRowKeys].sort(),
    [...leftHandKeys, ...rightHandKeys].sort(),
  );

  t.deepEqual(intersection(digitRowKeys, topRowKeys), []);
  t.deepEqual(intersection(digitRowKeys, homeRowKeys), []);
  t.deepEqual(intersection(digitRowKeys, bottomRowKeys), []);
  t.deepEqual(intersection(topRowKeys, homeRowKeys), []);
  t.deepEqual(intersection(topRowKeys, bottomRowKeys), []);
  t.deepEqual(intersection(homeRowKeys, bottomRowKeys), []);
  t.deepEqual(intersection(leftHandKeys, rightHandKeys), []);
});

function intersection<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): T[] {
  const result = new Set<T>();
  for (const value of a) {
    if (b.has(value)) {
      result.add(value);
    }
  }
  return [...result];
}
