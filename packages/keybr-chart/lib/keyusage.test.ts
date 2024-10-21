import { test } from "node:test";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { makeKeyStatsMap, ResultFaker } from "@keybr/result";
import { expect } from "chai";
import { keyUsage } from "./keyusage.ts";

const faker = new ResultFaker();
const { letters } = FakePhoneticModel;

test("empty", () => {
  const { keySet, hit, miss, ratio } = keyUsage(makeKeyStatsMap(letters, []));
  expect([...keySet]).deep.eq(letters);
  expect([...hit.values()]).deep.eq([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  expect([...miss.values()]).deep.eq([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  expect([...ratio.values()]).deep.eq([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

test("not empty", () => {
  const { keySet, hit, miss, ratio } = keyUsage(
    makeKeyStatsMap(letters, faker.nextResultList(3)),
  );
  expect([...keySet]).deep.eq(letters);
  expect([...hit.values()]).deep.eq([30, 30, 30, 30, 30, 30, 30, 30, 30, 30]);
  expect([...miss.values()]).deep.eq([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  expect([...ratio.values()]).deep.eq([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});
