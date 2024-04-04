import test from "ava";
import { preprocess } from "./preprocess.ts";

test("flatten", (t) => {
  preprocess("plain_text", "lorem ipsum");
  preprocess("markdown", "lorem ipsum");

  t.pass();
});
