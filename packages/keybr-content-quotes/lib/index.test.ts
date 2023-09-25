import test from "ava";
import { nextQuote } from "./index.ts";

test("generate quotes", (t) => {
  for (let i = 0; i < 100; i++) {
    t.true(nextQuote().length > 0);
  }
});
