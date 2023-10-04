import test from "ava";
import { formatReport, inspectError } from "./inspect.ts";

const macro = test.macro((t, input: any, expected: string) => {
  t.is(formatReport(inspectError(input), false), expected);
});

// Primitive values.

test("undefined", macro, undefined, "[object Undefined]");
test("null", macro, null, "[object Null]");
test("number", macro, 123, "123 (type=[object Number])");
test("string", macro, "abc", "abc (type=[object String])");
test("symbol", macro, Symbol(), "Symbol() (type=[object Symbol])");

// Error objects.

test("Error", macro, new Error(), "Error");
test("Error with empty message", macro, new Error(""), "Error");
test("Error with message", macro, new Error("abc"), "Error: abc");
test(
  "Error with message and cause",
  macro,
  new Error("abc", { cause: new RangeError("xyz") }),
  "Error: abc\n\nCause: RangeError: xyz",
);
test("TypeError", macro, new TypeError(), "TypeError");
test("TypeError with empty message", macro, new TypeError(""), "TypeError");
test("TypeError with message", macro, new TypeError("abc"), "TypeError: abc");
test(
  "TypeError with message and cause",
  macro,
  new TypeError("Outer", { cause: new RangeError("Inner") }),
  "TypeError: Outer\n\nCause: RangeError: Inner",
);

// DOMException objects.

test(
  "DOMException",
  macro,
  new DOMException(),
  "Error (code=0) (type=[object DOMException])",
);
test(
  "DOMException with message",
  macro,
  new DOMException("abc"),
  "Error: abc (code=0) (type=[object DOMException])",
);
test(
  "DOMException with message and code",
  macro,
  new DOMException("abc", "AbortError"),
  "AbortError: abc (code=20) (type=[object DOMException])",
);

// Custom objects.

test("Custom object", macro, {}, "Unknown (type=[object Object])");
test(
  "Custom object with name",
  macro,
  { name: "Foo" },
  "Foo (type=[object Object])",
);
test(
  "Custom object with message",
  macro,
  { message: "abc" },
  "Unknown: abc (type=[object Object])",
);
test(
  "Custom object with code",
  macro,
  { code: "ENOENT" },
  "Unknown (code=ENOENT) (type=[object Object])",
);
test(
  "Custom object with name, message and code",
  macro,
  { name: "Foo", message: "abc", code: "ENOENT" },
  "Foo: abc (code=ENOENT) (type=[object Object])",
);
test(
  "Custom object with getters for name, message and code",
  macro,
  {
    get name() {
      return "Foo";
    },
    get message() {
      return "abc";
    },
    get code() {
      return "ENOENT";
    },
  },
  "Foo: abc (code=ENOENT) (type=[object Object])",
);
test(
  "Custom object with name and cause",
  macro,
  { name: "Foo", cause: "xyz" },
  "Foo (type=[object Object])\n\nCause: xyz (type=[object String])",
);
test("Date object", macro, new Date(0), "Unknown (type=[object Date])");
