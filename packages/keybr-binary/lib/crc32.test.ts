import { test } from "node:test";
import { equal } from "rich-assert";
import { crc32 } from "./crc32.ts";

test("compute checksum", () => {
  equal(crc32(Buffer.from("")), 0);
  equal(crc32(Buffer.from("\u0000")), 0xd202ef8d);
  equal(crc32(Buffer.from("hello")), 0x3610a686);
});
