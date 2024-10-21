import { test } from "node:test";
import { assert } from "chai";
import { crc32 } from "./crc32.ts";

test("compute checksum", () => {
  assert.strictEqual(crc32(Buffer.from("")), 0);
  assert.strictEqual(crc32(Buffer.from("\u0000")), 0xd202ef8d);
  assert.strictEqual(crc32(Buffer.from("hello")), 0x3610a686);
});
