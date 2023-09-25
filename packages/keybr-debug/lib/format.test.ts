import test from "ava";
import { format } from "./format.ts";

test("format null or empty value", (t) => {
  t.is(format(undefined), "<undefined>");
  t.is(format(null), "<null>");
  t.is(format(""), "<empty>");
});

test("format primitive value", (t) => {
  t.is(format(123), "123");
  t.is(format("OMG"), "OMG");
  t.is(format(Symbol()), "Symbol()");
  t.is(format(Symbol("OMG")), "Symbol(OMG)");
});

test("format error object", (t) => {
  t.is(format(new Error()), "Error");
  t.is(format(new Error("OMG")), "Error: OMG");
  t.is(format(new TypeError()), "TypeError");
  t.is(format(new TypeError("OMG")), "TypeError: OMG");
  t.is(
    format(new TypeError("Outer", { cause: new ReferenceError("Inner") })),
    "TypeError: Outer\nBecause: ReferenceError: Inner",
  );
});

test("format dom exception object", (t) => {
  t.is(
    format(new DOMException()),
    "Error (code=0) (type=[object DOMException])",
  );
  t.is(
    format(new DOMException("OMG")),
    "Error: OMG (code=0) (type=[object DOMException])",
  );
  t.is(
    format(new DOMException("OMG", "AbortError")),
    "AbortError: OMG (code=20) (type=[object DOMException])",
  );
});

test("format custom object", (t) => {
  t.is(format({}), "Unknown (type=[object Object])");
  t.is(format({ name: "Foo" }), "Foo (type=[object Object])");
  t.is(format({ message: "OMG" }), "Unknown: OMG (type=[object Object])");
  t.is(
    format({ code: "ENOENT" }),
    "Unknown (code=ENOENT) (type=[object Object])",
  );
  t.is(
    format({ name: "Foo", message: "OMG", code: "ENOENT" }),
    "Foo: OMG (code=ENOENT) (type=[object Object])",
  );
  t.is(
    format({
      get name() {
        return "Foo";
      },
      get message() {
        return "OMG";
      },
      get code() {
        return "ENOENT";
      },
    }),
    "Foo: OMG (code=ENOENT) (type=[object Object])",
  );
  t.is(format(new Date(0)), "Unknown (type=[object Date])");
});
