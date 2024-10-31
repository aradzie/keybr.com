import { test } from "node:test";
import { assert } from "chai";
import { validate } from "./validate.ts";

test("valid composed grammar", () => {
  assert.doesNotThrow(() => {
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
  assert.throws(() => {
    validate({
      rules: {
        start: {
          ref: "invalidRef",
        },
      },
      composes: [],
    });
  }, "Invalid ref <invalidRef>");
});

test("unreferenced rule", () => {
  assert.throws(() => {
    validate({
      rules: {
        start: "start",
        extra: "extra",
      },
      composes: [],
    });
  }, "Unreferenced rule <extra>");
});

test("empty seq", () => {
  assert.throws(() => {
    validate({
      rules: {
        start: { seq: [] },
      },
      composes: [],
    });
  }, "Empty seq");
});

test("empty alt", () => {
  assert.throws(() => {
    validate({
      rules: {
        start: { alt: [] },
      },
      composes: [],
    });
  }, "Empty alt");
});
