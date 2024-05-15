import { FakePhoneticModel } from "@keybr/phonetic-model";
import { makeKeyStatsMap, ResultFaker } from "@keybr/result";
import test from "ava";
import { keyUsage } from "./keyusage.ts";

const faker = new ResultFaker();
const { letters } = FakePhoneticModel;

test("empty", (t) => {
  const { keySet, hit, miss, ratio } = keyUsage(makeKeyStatsMap(letters, []));
  t.deepEqual([...keySet], letters);
  t.deepEqual([...hit.values()], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  t.deepEqual([...miss.values()], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  t.deepEqual([...ratio.values()], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

test("not empty", (t) => {
  const { keySet, hit, miss, ratio } = keyUsage(
    makeKeyStatsMap(letters, faker.nextResultList(3)),
  );
  t.deepEqual([...keySet], letters);
  t.deepEqual([...hit.values()], [30, 30, 30, 30, 30, 30, 30, 30, 30, 30]);
  t.deepEqual([...miss.values()], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  t.deepEqual([...ratio.values()], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});
