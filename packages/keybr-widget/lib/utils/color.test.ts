import test from "ava";
import { Color, HslColor, RgbColor } from "./color.ts";

test("construct", (t) => {
  t.deepEqual(
    { ...new RgbColor(0.1, 0.2, 0.3) },
    {
      r: 0.1,
      g: 0.2,
      b: 0.3,
      a: 1,
    },
  );
  t.deepEqual(
    { ...new RgbColor(0.1, 0.2, 0.3, 0.4) },
    {
      r: 0.1,
      g: 0.2,
      b: 0.3,
      a: 0.4,
    },
  );

  t.deepEqual(
    { ...new HslColor(0.1, 0.2, 0.3) },
    {
      h: 0.1,
      s: 0.2,
      l: 0.3,
      a: 1,
    },
  );
  t.deepEqual(
    { ...new HslColor(0.1, 0.2, 0.3, 0.4) },
    {
      h: 0.1,
      s: 0.2,
      l: 0.3,
      a: 0.4,
    },
  );
});

test("from RGB components", (t) => {
  t.is(
    new RgbColor({
      r: 17 / 255,
      g: 34 / 255,
      b: 51 / 255,
      a: 0.5,
    }).format(),
    "rgba(17,34,51,0.5)",
  );
  t.is(
    new RgbColor({
      r: 17 / 255,
      g: 34 / 255,
      b: 51 / 255,
      a: 1,
    }).format(),
    "rgb(17,34,51)",
  );
  t.is(
    new RgbColor(new RgbColor(17 / 255, 34 / 255, 51 / 255)).format(),
    "rgb(17,34,51)",
  );
  t.is(
    new RgbColor(new RgbColor(17 / 255, 34 / 255, 51 / 255, 0.5)).format(),
    "rgba(17,34,51,0.5)",
  );
  t.is(
    new RgbColor(new RgbColor(17 / 255, 34 / 255, 51 / 255, 1)).format(),
    "rgb(17,34,51)",
  );
});

test("from HSL components", (t) => {
  t.is(
    new HslColor({
      h: 0.5,
      s: 0.4,
      l: 0.3,
      a: 0.5,
    }).format(),
    "hsla(180,40%,30%,0.5)",
  );
  t.is(
    new HslColor({
      h: 0.5,
      s: 0.4,
      l: 0.3,
      a: 1,
    }).format(),
    "hsl(180,40%,30%)",
  );
});

test("from hex RGB string", (t) => {
  t.is(Color.parse("#112233").toRgb().formatHex(), "#112233");
  t.is(Color.parse("#112233").toRgb().formatHex(), "#112233");
});

test("from RGB string", (t) => {
  t.is(Color.parse("RGB(  17  ,  34  ,  51  )").format(), "rgb(17,34,51)");
  t.is(
    Color.parse("RGBA(  17  ,  34  ,  51  ,  0.5  )").format(),
    "rgba(17,34,51,0.5)",
  );
  t.is(Color.parse("rgb(17,34,51)").format(), "rgb(17,34,51)", "RGB string");
  t.is(Color.parse("rgba(17,34,51,0.5)").format(), "rgba(17,34,51,0.5)");
});

test("from RGB string percent values", (t) => {
  t.is(
    Color.parse("RGB(  6.66%  ,  13.33%  ,  20%  )").format(),
    "rgb(17,34,51)",
  );
  t.is(
    Color.parse("RGBA(  6.66%  ,  13.33%  ,  20%  ,  50%  )").format(),
    "rgba(17,34,51,0.5)",
  );
  t.is(Color.parse("rgb(6.66%,13.33%,20%)").format(), "rgb(17,34,51)");
  t.is(
    Color.parse("rgba(6.66%,13.33%,20%,50%)").format(),
    "rgba(17,34,51,0.5)",
  );
});

test("from HSL string", (t) => {
  t.is(
    Color.parse("HSL(  180  ,  40%  ,  30%  )").format(),
    "hsl(180,40%,30%)",
  );
  t.is(
    Color.parse("HSLA(  180  ,  40%  ,  30%  ,  0.5  )").format(),
    "hsla(180,40%,30%,0.5)",
  );
  t.is(Color.parse("hsl(180,40%,30%)").format(), "hsl(180,40%,30%)");
  t.is(Color.parse("hsla(180,40%,30%,0.5)").format(), "hsla(180,40%,30%,0.5)");
});

test("convert", (t) => {
  t.is(
    Color.rgb(0x112233).toHsl().toRgb().toHsl().toRgb().formatHex(),
    "#112233",
  );
  t.is(Color.rgb(0x000000).toHsl().format(), "hsl(0,0%,0%)");
  t.is(Color.rgb(0xffffff).toHsl().format(), "hsl(0,0%,100%)");
  t.is(Color.parse("hsl(0,0%,0%)").toRgb().formatHex(), "#000000");
  t.is(Color.parse("hsl(0,0%,100%)").toRgb().formatHex(), "#FFFFFF");
});

test("between", (t) => {
  t.is(
    RgbColor.between(Color.rgb(0x0080ff), Color.rgb(0xff8000), 0.5).formatHex(),
    "#808080",
  );
});

test("validate", (t) => {
  t.throws(() => {
    // @ts-expect-error Test invalid arguments.
    new RgbColor(null);
  });
  t.throws(() => {
    // @ts-expect-error Test invalid arguments.
    new HslColor(null);
  });
  t.throws(() => {
    Color.parse("?");
  });
  t.throws(() => {
    Color.parse("?");
  });
});
