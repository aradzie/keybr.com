import { Layout } from "@keybr/layout";
import { Histogram } from "@keybr/textinput";
import test from "ava";
import { Result, speedToTime, timeToSpeed } from "./result.ts";
import { TextType } from "./texttype.ts";

test("serialize as JSON", (t) => {
  const result = new Result(
    /* layout= */ Layout.EN_US,
    /* textType= */ TextType.GENERATED,
    /* timeStamp= */ Date.parse("2001-02-03T03:05:06Z"),
    /* length= */ 100,
    /* time= */ 10000,
    /* errors= */ 3,
    /* histogram= */ new Histogram([
      {
        codePoint: 97,
        hitCount: 11,
        missCount: 1,
        timeToType: 111,
      },
      {
        codePoint: 98,
        hitCount: 22,
        missCount: 2,
        timeToType: 222,
      },
      {
        codePoint: 99,
        hitCount: 33,
        missCount: 3,
        timeToType: 333,
      },
      {
        codePoint: 100,
        hitCount: 33,
        missCount: 3,
        timeToType: 333,
      },
      {
        codePoint: 101,
        hitCount: 33,
        missCount: 3,
        timeToType: 333,
      },
    ]),
  );

  t.deepEqual(JSON.parse(JSON.stringify(result)), {
    layout: "us",
    textType: "generated",
    timeStamp: "2001-02-03T03:05:06.000Z",
    length: 100,
    time: 10000,
    errors: 3,
    speed: 600,
    histogram: [
      {
        codePoint: 97,
        hitCount: 11,
        missCount: 1,
        timeToType: 111,
      },
      {
        codePoint: 98,
        hitCount: 22,
        missCount: 2,
        timeToType: 222,
      },
      {
        codePoint: 99,
        hitCount: 33,
        missCount: 3,
        timeToType: 333,
      },
      {
        codePoint: 100,
        hitCount: 33,
        missCount: 3,
        timeToType: 333,
      },
      {
        codePoint: 101,
        hitCount: 33,
        missCount: 3,
        timeToType: 333,
      },
    ],
  });
});

test("convert", (t) => {
  t.throws(() => timeToSpeed(Infinity));
  t.throws(() => timeToSpeed(NaN));
  t.throws(() => timeToSpeed(0));
  t.throws(() => speedToTime(Infinity));
  t.throws(() => speedToTime(NaN));
  t.throws(() => speedToTime(0));
  t.is(timeToSpeed(250), 240);
  t.is(timeToSpeed(100), 600);
  t.is(speedToTime(240), 250);
  t.is(speedToTime(600), 100);
});
