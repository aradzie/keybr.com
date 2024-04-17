import test from "ava";
import { validate } from "./validate.ts";

test("valid grammar", (t) => {
  t.notThrows(() => {
    validate({
      rule: {
        start: {
          ref: "another",
        },
        another: "stop",
      },
    });
  });
});

test("missing ref", (t) => {
  t.throws(
    () => {
      validate({
        rule: {
          start: {
            ref: "invalidRef",
          },
        },
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
        rule: {
          start: "start",
          extra: "extra",
        },
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
        rule: {
          start: { seq: [] },
        },
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
        rule: {
          start: { alt: [] },
        },
      });
    },
    {
      message: "Empty alt",
    },
  );
});
