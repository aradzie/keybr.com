import { test } from "node:test";
import { deepEqual, like } from "rich-assert";
import { OklchColor } from "./color-oklch.ts";
import { RgbColor } from "./color-rgb.ts";
import {
  linearRgbToXyz,
  oklchToRgb,
  rgbGammaToLinear,
  rgbLinearToGamma,
  rgbToOklch,
  xyzToLinearRgb,
} from "./convert-xyz.ts";

test("gamma rgb / linear rgb", () => {
  const a = { r: 0, g: 0, b: 0, a: 0 };
  const b = { r: 0, g: 0, b: 0, a: 0 };

  a.r = 0;
  a.g = 0;
  a.b = 0;
  a.a = 0.5;
  rgbGammaToLinear(a, b);
  deepEqual(b, { r: 0, g: 0, b: 0, a: 0.5 });

  rgbLinearToGamma(b, a);
  deepEqual(a, { r: 0, g: 0, b: 0, a: 0.5 });

  a.r = 0.1;
  a.g = 0.2;
  a.b = 0.3;
  a.a = 0.5;
  rgbGammaToLinear(a, b);
  deepEqual(b, { r: 0.010022825574869039, g: 0.033104766570885055, b: 0.07323895587840543, a: 0.5 });

  rgbLinearToGamma(b, a);
  deepEqual(a, { r: 0.1, g: 0.2, b: 0.3, a: 0.5 });

  a.r = 1;
  a.g = 1;
  a.b = 1;
  a.a = 0.5;
  rgbGammaToLinear(a, b);
  deepEqual(b, { r: 1, g: 1, b: 1, a: 0.5 });

  rgbLinearToGamma(b, a);
  deepEqual(a, { r: 0.9999999999999999, g: 0.9999999999999999, b: 0.9999999999999999, a: 0.5 });
});

test("linear rgb / xyz", () => {
  const a = { r: 0, g: 0, b: 0, a: 0 };
  const b = { x: 0, y: 0, z: 0, a: 0 };

  a.r = 0;
  a.g = 0;
  a.b = 0;
  a.a = 0.5;
  linearRgbToXyz(a, b);
  deepEqual(b, { x: 0, y: 0, z: 0, a: 0.5 });

  xyzToLinearRgb(b, a);
  deepEqual(a, { r: 0, g: 0, b: 0, a: 0.5 });

  a.r = 0.1;
  a.g = 0.2;
  a.b = 0.3;
  a.a = 0.5;
  linearRgbToXyz(a, b);
  deepEqual(b, { x: 0.16690018432392184, y: 0.18595533094892233, z: 0.31093168350538253, a: 0.5 });

  xyzToLinearRgb(b, a);
  deepEqual(a, { r: 0.10000000000000006, g: 0.19999999999999998, b: 0.3, a: 0.5 });

  a.r = 1;
  a.g = 1;
  a.b = 1;
  a.a = 0.5;
  linearRgbToXyz(a, b);
  deepEqual(b, { x: 0.9504559270516717, y: 0.9999999999999999, z: 1.0890577507598784, a: 0.5 });

  xyzToLinearRgb(b, a);
  deepEqual(a, { r: 1, g: 0.9999999999999998, b: 1, a: 0.5 });
});

test("rgb / oklch", () => {
  like(rgbToOklch(new RgbColor(0, 0, 0, 0.5)), {
    L: 0,
    C: 0,
    h: 0,
    a: 0.5,
  });
  like(oklchToRgb(new OklchColor(0, 0, 0, 0.5)), {
    r: 0,
    g: 0,
    b: 0,
    a: 0.5,
  });

  like(rgbToOklch(new RgbColor(1, 0, 0, 0.5)), {
    L: 0.6279553639214313,
    C: 0.25768330380536064,
    h: 0.08120522299896633,
    a: 0.5,
  });
  like(oklchToRgb(new OklchColor(0.6279553639214313, 0.25768330380536064, 0.08120522299896633, 0.5)), {
    r: 0.9999999999999997,
    g: 5.028833252596066e-15,
    b: 0,
    a: 0.5,
  });

  like(rgbToOklch(new RgbColor(1, 1, 1, 0.5)), {
    L: 1,
    C: 4.996003610813204e-16,
    h: 0.5,
    a: 0.5,
  });
  like(oklchToRgb(new OklchColor(1, 0, 0.5, 0.5)), {
    r: 1,
    g: 0.9999999999999997,
    b: 0.9999999999999997,
    a: 0.5,
  });
});
