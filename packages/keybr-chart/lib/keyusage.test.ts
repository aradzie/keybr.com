import { test } from "node:test";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { makeKeyStatsMap, ResultFaker } from "@keybr/result";
import { deepEqual } from "rich-assert";
import { keyUsage } from "./keyusage.ts";

const faker = new ResultFaker();
const { letters } = FakePhoneticModel;

test("empty", () => {
  const { keySet, hit, miss, ratio } = keyUsage(makeKeyStatsMap(letters, []));
  deepEqual([...keySet], letters);
  deepEqual([...hit.values()], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  deepEqual([...miss.values()], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  deepEqual([...ratio.values()], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

test("not empty", () => {
  const { keySet, hit, miss, ratio } = keyUsage(
    makeKeyStatsMap(letters, faker.nextResultList(3)),
  );
  deepEqual([...keySet], letters);
  deepEqual([...hit.values()], [30, 30, 30, 30, 30, 30, 30, 30, 30, 30]);
  deepEqual([...miss.values()], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  deepEqual([...ratio.values()], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});
