import { strictEqual, throws } from "node:assert/strict";
import { test } from "node:test";
import { parseColor } from "./parse.ts";

test("validate", () => {
  throws(() => {
    parseColor("?");
  });
});

test("from hex RGB string", () => {
  strictEqual(parseColor("#112233").toRgb().formatHex(), "#112233");
  strictEqual(parseColor("#112233").toRgb().formatHex(), "#112233");
});

test("from RGB string", () => {
  strictEqual(
    parseColor("RGB(  17  ,  34  ,  51  )").format(),
    "rgb(17,34,51)",
  );
  strictEqual(
    parseColor("RGBA(  17  ,  34  ,  51  ,  0.5  )").format(),
    "rgba(17,34,51,0.5)",
  );
  strictEqual(
    parseColor("rgb(17,34,51)").format(),
    "rgb(17,34,51)",
    "RGB string",
  );
  strictEqual(parseColor("rgba(17,34,51,0.5)").format(), "rgba(17,34,51,0.5)");
});

test("from RGB string percent values", () => {
  strictEqual(
    parseColor("RGB(  6.66%  ,  13.33%  ,  20%  )").format(),
    "rgb(17,34,51)",
  );
  strictEqual(
    parseColor("RGBA(  6.66%  ,  13.33%  ,  20%  ,  50%  )").format(),
    "rgba(17,34,51,0.5)",
  );
  strictEqual(parseColor("rgb(6.66%,13.33%,20%)").format(), "rgb(17,34,51)");
  strictEqual(
    parseColor("rgba(6.66%,13.33%,20%,50%)").format(),
    "rgba(17,34,51,0.5)",
  );
});

test("from HSL string", () => {
  strictEqual(
    parseColor("HSL(  180  ,  40%  ,  30%  )").format(),
    "hsl(180,40%,30%)",
  );
  strictEqual(
    parseColor("HSLA(  180  ,  40%  ,  30%  ,  0.5  )").format(),
    "hsla(180,40%,30%,0.5)",
  );
  strictEqual(parseColor("hsl(180,40%,30%)").format(), "hsl(180,40%,30%)");
  strictEqual(
    parseColor("hsla(180,40%,30%,0.5)").format(),
    "hsla(180,40%,30%,0.5)",
  );
});
