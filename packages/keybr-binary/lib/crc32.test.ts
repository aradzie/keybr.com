import test from "ava";
import { crc32 } from "./crc32.ts";

test("compute checksum", (t) => {
  t.is(crc32(Buffer.from("")), 0);
  t.is(crc32(Buffer.from("\u0000")), 0xd202ef8d);
  t.is(crc32(Buffer.from("hello")), 0x3610a686);
});
