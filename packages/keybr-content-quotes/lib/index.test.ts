import { test } from "node:test";
import { assert } from "chai";
import { nextQuote } from "./index.ts";

test("generate quotes", (t) => {
  for (let i = 0; i < 100; i++) {
    assert.isTrue(nextQuote().length > 0);
  }
});
