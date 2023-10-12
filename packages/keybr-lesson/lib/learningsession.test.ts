import { generateKeySamples, type KeySample } from "@keybr/result";
import test from "ava";
import { findSession } from "./learningsession.ts";

test("find session, no samples", (t) => {
  t.deepEqual(findSession([]), []);
});

test("find session, one sample", (t) => {
  const samples: KeySample[] = [
    {
      index: 100,
      timeStamp: 1000,
      hitCount: 10,
      missCount: 1,
      timeToType: 500,
      filteredTimeToType: 500,
    },
  ];
  t.deepEqual(findSession(samples), samples);
});

test("find session, after a break", (t) => {
  const samples: KeySample[] = [
    {
      index: 100,
      timeStamp: 1000,
      hitCount: 10,
      missCount: 1,
      timeToType: 500,
      filteredTimeToType: 500,
    },
    {
      index: 101,
      timeStamp: 1000 + 3600000 + 1,
      hitCount: 10,
      missCount: 1,
      timeToType: 500,
      filteredTimeToType: 500,
    },
  ];
  t.deepEqual(findSession(samples), samples.slice(-1));
});

test("find session, increasing speed streak", (t) => {
  const samples = [
    {
      index: 100,
      timeStamp: 1000,
      hitCount: 10,
      missCount: 1,
      timeToType: 300,
      filteredTimeToType: 300,
    },
    ...generateKeySamples(5, {
      indexStart: 101,
      timeStampStart: 61000,
      timeToTypeStart: 500,
      timeToTypeStep: +10,
    }),
  ];
  t.deepEqual(findSession(samples), samples.slice(1));
});
