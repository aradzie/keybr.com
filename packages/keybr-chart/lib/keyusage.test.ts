import { FakePhoneticModel } from "@keybr/phonetic-model";
import { newKeyStatsMap, ResultFaker } from "@keybr/result";
import test from "ava";
import { keyUsage } from "./keyusage.ts";

const faker = new ResultFaker();
const { letters } = FakePhoneticModel;

test("empty", (t) => {
  const { keySet, hit, miss } = keyUsage(newKeyStatsMap(letters, []));
  t.deepEqual([...keySet], letters);
  t.deepEqual(hit.asVector().values, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  t.deepEqual(miss.asVector().values, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

test("not empty", (t) => {
  const { keySet, hit, miss } = keyUsage(
    newKeyStatsMap(letters, faker.nextResultList(3)),
  );
  t.deepEqual([...keySet], letters);
  t.deepEqual(hit.asVector().values, [30, 30, 30, 30, 30, 30, 30, 30, 30, 30]);
  t.deepEqual(miss.asVector().values, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});
