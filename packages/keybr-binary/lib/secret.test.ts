import { test } from "node:test";
import { equal, notEqual, throws } from "rich-assert";
import { DataError } from "./errors.ts";
import { scramble, unscramble } from "./secret.ts";

test("scramble then unscramble the given examples", async (t) => {
  await macro("");
  await macro("\u0000");
  await macro("arbitrary string");

  function macro(input: string) {
    return t.test(`example: "${input}"`, () => {
      const encoded = scramble(Buffer.from(input));
      notEqual(input, String(Buffer.from(encoded)));
      const decoded = unscramble(encoded);
      equal(input, String(Buffer.from(decoded)));
    });
  }
});

test("unscramble the provided examples", () => {
  const encoded = new Uint8Array([
    0x5e, 0x34, 0x29, 0x29, 0xeb, 0x08, 0xe9, 0x89, 0xa8, 0x1b, 0xa6, 0x12,
    0x5a, 0xe6,
  ]);
  const decoded = unscramble(encoded);
  equal(String(Buffer.from(decoded)), "secret");
});

test("throw error if the input data is invalid", () => {
  throws(() => {
    unscramble(Buffer.from("invalid"));
  }, DataError);
});
