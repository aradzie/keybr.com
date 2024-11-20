import { test } from "node:test";
import { isTrue } from "rich-assert";
import { nextQuote } from "./index.ts";

test("generate quotes", () => {
  for (let i = 0; i < 100; i++) {
    isTrue(nextQuote().length > 0);
  }
});
