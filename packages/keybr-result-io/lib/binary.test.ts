import { Reader, Writer } from "@keybr/binary";
import { Layout } from "@keybr/layout";
import { Result, TextType } from "@keybr/result";
import { Histogram } from "@keybr/textinput";
import test from "ava";
import { readResult, writeResult } from "./binary.ts";

test("write and read", (t) => {
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

  const writer = new Writer();

  writeResult(writer, result);
  writeResult(writer, result);
  writeResult(writer, result);

  const buffer = writer.buffer();

  t.is(buffer.byteLength, 105);

  const reader = new Reader(buffer);

  t.deepEqual(readResult(reader), result);
  t.deepEqual(readResult(reader), result);
  t.deepEqual(readResult(reader), result);

  t.is(reader.remaining(), 0);
});
