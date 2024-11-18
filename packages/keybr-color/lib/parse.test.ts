import { equal, throws } from "node:assert/strict";
import { test } from "node:test";
import { parseColor } from "./parse.ts";

test("validate", () => {
  throws(() => {
    parseColor("?");
  });
});

test("from hex RGB string", () => {
  equal(parseColor("#112233").toRgb().formatHex(), "#112233");
  equal(parseColor("#112233").toRgb().formatHex(), "#112233");
});

test("from RGB string", () => {
  equal(parseColor("RGB(  17  ,  34  ,  51  )").format(), "rgb(17,34,51)");
  equal(
    parseColor("RGBA(  17  ,  34  ,  51  ,  0.5  )").format(),
    "rgba(17,34,51,0.5)",
  );
  equal(parseColor("rgb(17,34,51)").format(), "rgb(17,34,51)", "RGB string");
  equal(parseColor("rgba(17,34,51,0.5)").format(), "rgba(17,34,51,0.5)");
});

test("from RGB string percent values", () => {
  equal(
    parseColor("RGB(  6.66%  ,  13.33%  ,  20%  )").format(),
    "rgb(17,34,51)",
  );
  equal(
    parseColor("RGBA(  6.66%  ,  13.33%  ,  20%  ,  50%  )").format(),
    "rgba(17,34,51,0.5)",
  );
  equal(parseColor("rgb(6.66%,13.33%,20%)").format(), "rgb(17,34,51)");
  equal(
    parseColor("rgba(6.66%,13.33%,20%,50%)").format(),
    "rgba(17,34,51,0.5)",
  );
});

test("from HSL string", () => {
  equal(
    parseColor("HSL(  180  ,  40%  ,  30%  )").format(),
    "hsl(180,40%,30%)",
  );
  equal(
    parseColor("HSLA(  180  ,  40%  ,  30%  ,  0.5  )").format(),
    "hsla(180,40%,30%,0.5)",
  );
  equal(parseColor("hsl(180,40%,30%)").format(), "hsl(180,40%,30%)");
  equal(parseColor("hsla(180,40%,30%,0.5)").format(), "hsla(180,40%,30%,0.5)");
});
