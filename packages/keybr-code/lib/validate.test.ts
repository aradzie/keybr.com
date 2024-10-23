import test from "ava";
import { validate } from "./validate.ts";

test("valid composed grammar", (t) => {
  t.notThrows(() => {
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

test("missing ref", (t) => {
  t.throws(
    () => {
      validate({
        rules: {
          start: {
            ref: "invalidRef",
          },
        },
        composes: [],
      });
    },
    {
      message: "Invalid ref <invalidRef>",
    },
  );
});

test("unreferenced rule", (t) => {
  t.throws(
    () => {
      validate({
        rules: {
          start: "start",
          extra: "extra",
        },
        composes: [],
      });
    },
    {
      message: "Unreferenced rule <extra>",
    },
  );
});

test("empty seq", (t) => {
  t.throws(
    () => {
      validate({
        rules: {
          start: { seq: [] },
        },
        composes: [],
      });
    },
    {
      message: "Empty seq",
    },
  );
});

test("empty alt", (t) => {
  t.throws(
    () => {
      validate({
        rules: {
          start: { alt: [] },
        },
        composes: [],
      });
    },
    {
      message: "Empty alt",
    },
  );
});
