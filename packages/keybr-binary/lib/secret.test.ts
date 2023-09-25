import test, { type Assertions } from "ava";
import { DataError } from "./errors.ts";
import { scramble, unscramble } from "./secret.ts";

test(
  'scramble then unscramble ""',
  macro,
  "", // empty string
);
test(
  'scramble then unscramble "\\u0000"',
  macro,
  "\u0000", // contains zero chars
);
test(
  "scramble then unscramble arbitrary string",
  macro,
  "The quick brown fox jumps over the lazy dog.",
);

function macro(t: Assertions, input: string): void {
  const encoded = scramble(Buffer.from(input));
  t.not(input, String(Buffer.from(encoded)));
  const decoded = unscramble(encoded);
  t.is(input, String(Buffer.from(decoded)));
}

test("unscramble provided examples", (t) => {
  // prettier-ignore
  const encoded = new Uint8Array([
    94, 52, 41, 41, -21, 8, -23, -119, -88, 27, -90, 18, 90, -26,
  ]);
  const decoded = unscramble(encoded);
  t.is(String(Buffer.from(decoded)), "secret");
});

test("throw error", (t) => {
  t.throws(
    () => {
      unscramble(Buffer.from("invalid"));
    },
    { instanceOf: DataError },
  );
});
