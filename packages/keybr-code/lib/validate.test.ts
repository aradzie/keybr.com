import { test } from "node:test";
import { doesNotThrow, throws } from "rich-assert";
import { validate } from "./validate.ts";

test("valid composed grammar", () => {
  doesNotThrow(() => {
    validate({
      rules: {
        start: {
          ref: "another",
        },
      },
      composes: [
        {
          rules: {
            another: "stop",
          },
          composes: [],
        },
      ],
    });
  });
});

test("missing ref", () => {
  throws(() => {
    validate({
      rules: {
        start: {
          ref: "invalidRef",
        },
      },
      composes: [],
    });
  }, /Invalid ref <invalidRef>/);
});

test("unreferenced rule", () => {
  throws(() => {
    validate({
      rules: {
        start: "start",
        extra: "extra",
      },
      composes: [],
    });
  }, /Unreferenced rule <extra>/);
});

test("empty seq", () => {
  throws(() => {
    validate({
      rules: {
        start: { seq: [] },
      },
      composes: [],
    });
  }, /Empty seq/);
});

test("empty alt", () => {
  throws(() => {
    validate({
      rules: {
        start: { alt: [] },
      },
      composes: [],
    });
  }, /Empty alt/);
});
