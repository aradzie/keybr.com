import { Layout } from "@keybr/keyboard";
import { Histogram } from "@keybr/textinput";
import test from "ava";
import { Result, speedToTime, timeToSpeed } from "./result.ts";
import { TextType } from "./texttype.ts";

test("validate", (t) => {
  t.false(
    new Result(
      /* layout= */ Layout.EN_US,
      /* textType= */ TextType.GENERATED,
      /* timeStamp= */ Date.parse("2001-02-03T03:05:06Z"),
      /* length= */ 9,
      /* time= */ 999,
      /* errors= */ 0,
      /* histogram= */ new Histogram([]),
    ).validate(),
  );

  t.false(
    new Result(
      /* layout= */ Layout.EN_US,
      /* textType= */ TextType.GENERATED,
      /* timeStamp= */ Date.parse("2001-02-03T03:05:06Z"),
      /* length= */ 9,
      /* time= */ 999,
      /* errors= */ 0,
      /* histogram= */ new Histogram([
        { codePoint: 0x0061, hitCount: 11, missCount: 1, timeToType: 111 },
        { codePoint: 0x0062, hitCount: 22, missCount: 2, timeToType: 222 },
        { codePoint: 0x0063, hitCount: 33, missCount: 3, timeToType: 333 },
      ]),
    ).validate(),
  );

  t.true(
    new Result(
      /* layout= */ Layout.EN_US,
      /* textType= */ TextType.GENERATED,
      /* timeStamp= */ Date.parse("2001-02-03T03:05:06Z"),
      /* length= */ 10,
      /* time= */ 1000,
      /* errors= */ 0,
      /* histogram= */ new Histogram([
        { codePoint: 0x0061, hitCount: 11, missCount: 1, timeToType: 111 },
        { codePoint: 0x0062, hitCount: 22, missCount: 2, timeToType: 222 },
        { codePoint: 0x0063, hitCount: 33, missCount: 3, timeToType: 333 },
      ]),
    ).validate(),
  );
});

test("serialize as JSON", (t) => {
  const result = new Result(
    /* layout= */ Layout.EN_US,
    /* textType= */ TextType.GENERATED,
    /* timeStamp= */ Date.parse("2001-02-03T03:05:06Z"),
    /* length= */ 100,
    /* time= */ 10000,
    /* errors= */ 3,
    /* histogram= */ new Histogram([
      { codePoint: 0x0061, hitCount: 11, missCount: 1, timeToType: 111 },
      { codePoint: 0x0062, hitCount: 22, missCount: 2, timeToType: 222 },
      { codePoint: 0x0063, hitCount: 33, missCount: 3, timeToType: 333 },
    ]),
  );

  t.deepEqual(JSON.parse(JSON.stringify(result)), {
    layout: "en-us",
    textType: "generated",
    timeStamp: "2001-02-03T03:05:06.000Z",
    length: 100,
    time: 10000,
    errors: 3,
    speed: 600,
    histogram: [
      { codePoint: 0x0061, hitCount: 11, missCount: 1, timeToType: 111 },
      { codePoint: 0x0062, hitCount: 22, missCount: 2, timeToType: 222 },
      { codePoint: 0x0063, hitCount: 33, missCount: 3, timeToType: 333 },
    ],
  });
});

test("convert units", (t) => {
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
