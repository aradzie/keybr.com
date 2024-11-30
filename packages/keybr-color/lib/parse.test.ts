import { describe, it, test } from "node:test";
import { equal, throws } from "rich-assert";
import { parseColor } from "./parse.ts";

test("validate", () => {
  throws(() => {
    parseColor("?");
  });
  throws(() => {
    parseColor("#");
  });
  throws(() => {
    parseColor("#ff");
  });
  throws(() => {
    parseColor("#ff f");
  });
  throws(() => {
    parseColor("rgb");
  });
  throws(() => {
    parseColor("rgb()");
  });
});

test("parse named", () => {
  equal(parseColor("transparent").format(), "rgb(0 0 0/0)");
  equal(parseColor("white").format(), "rgb(255 255 255)");
  equal(parseColor("gray").format(), "rgb(128 128 128)");
  equal(parseColor("red").format(), "rgb(255 0 0)");
  equal(parseColor("green").format(), "rgb(0 128 0)");
  equal(parseColor("blue").format(), "rgb(0 0 255)");
  equal(parseColor("black").format(), "rgb(0 0 0)");
});

describe("parse angle", () => {
  it("should wrap around", () => {
    equal(parseColor("hsl(+100.0 0% 0%)").format(), "hsl(100 0% 0%)");
    equal(parseColor("hsl(+360.0 0% 0%)").format(), "hsl(360 0% 0%)");
    equal(parseColor("hsl(+460.0 0% 0%)").format(), "hsl(100 0% 0%)");
    equal(parseColor("hsl(-100.0 0% 0%)").format(), "hsl(260 0% 0%)");
    equal(parseColor("hsl(-460.0 0% 0%)").format(), "hsl(260 0% 0%)");
  });

  it("should parse the percent unit", () => {
    equal(parseColor("hsl(+50.00% 0% 0%)").format(), "hsl(180 0% 0%)");
    equal(parseColor("hsl(+100.00% 0% 0%)").format(), "hsl(360 0% 0%)");
    equal(parseColor("hsl(-50.00% 0% 0%)").format(), "hsl(180 0% 0%)");
    equal(parseColor("hsl(-100.00% 0% 0%)").format(), "hsl(0 0% 0%)");
  });

  it("should parse the degree unit", () => {
    equal(parseColor("hsl(+180.00deg 0% 0%)").format(), "hsl(180 0% 0%)");
    equal(parseColor("hsl(+360.00deg 0% 0%)").format(), "hsl(360 0% 0%)");
    equal(parseColor("hsl(-180.00deg 0% 0%)").format(), "hsl(180 0% 0%)");
    equal(parseColor("hsl(-360.00deg 0% 0%)").format(), "hsl(0 0% 0%)");
  });

  it("should parse the radian unit", () => {
    equal(parseColor("hsl(+1.570796327rad 0% 0%)").format(), "hsl(90 0% 0%)");
    equal(parseColor("hsl(+3.141592653rad 0% 0%)").format(), "hsl(180 0% 0%)");
    equal(parseColor("hsl(-3.141592653rad 0% 0%)").format(), "hsl(180 0% 0%)");
  });

  it("should parse the turn unit", () => {
    equal(parseColor("hsl(+0.25turn 0% 0%)").format(), "hsl(90 0% 0%)");
    equal(parseColor("hsl(+0.50turn 0% 0%)").format(), "hsl(180 0% 0%)");
    equal(parseColor("hsl(+1.0turn 0% 0%)").format(), "hsl(360 0% 0%)");
    equal(parseColor("hsl(-0.5turn 0% 0%)").format(), "hsl(180 0% 0%)");
  });
});

describe("parse percent", () => {
  it("should clamp", () => {
    equal(parseColor("hsl(0 +123.456% -123.456%)").format(), "hsl(0 100% 0%)");
  });
});

describe("parse number", () => {
  it("should parse scientific notation", () => {
    equal(parseColor("hsl(+1e2 0% 0%)").format(), "hsl(100 0% 0%)");
    equal(parseColor("hsl(+1E2 0% 0%)").format(), "hsl(100 0% 0%)");
    equal(parseColor("hsl(-1.000e2 0% 0%)").format(), "hsl(260 0% 0%)");
    equal(parseColor("hsl(-1.000E2 0% 0%)").format(), "hsl(260 0% 0%)");
    equal(parseColor("hsl(+1E+2 0% 0%)").format(), "hsl(100 0% 0%)");
    equal(parseColor("hsl(+1000E-1 0% 0%)").format(), "hsl(100 0% 0%)");
  });
});

test("hex", () => {
  equal(parseColor("#123").toRgb().formatHex(), "#112233");
  equal(parseColor("#1234").toRgb().formatHex(), "#11223344");
  equal(parseColor("#112233").toRgb().formatHex(), "#112233");
  equal(parseColor("#11223344").toRgb().formatHex(), "#11223344");
});

test("rgb", () => {
  equal(parseColor("rgb(none none none)").format(), "rgb(0 0 0)");
  equal(parseColor("rgb(none none none/none)").format(), "rgb(0 0 0)");

  equal(parseColor("rgb(17 34 51)").format(), "rgb(17 34 51)");
  equal(parseColor("rgb(17 34 51/0.5)").format(), "rgb(17 34 51/0.5)");
  equal(parseColor("rgba(17 34 51/0.5)").format(), "rgb(17 34 51/0.5)");

  equal(parseColor("rgb(6.66% 13.33% 20%)").format(), "rgb(17 34 51)");
  equal(parseColor("rgb(6.66% 13.33% 20%/50%)").format(), "rgb(17 34 51/0.5)");
  equal(parseColor("rgba(6.66% 13.33% 20%/50%)").format(), "rgb(17 34 51/0.5)");
});

test("legacy rgb", () => {
  equal(parseColor("rgb(17,34,51)").format(), "rgb(17 34 51)");
  equal(parseColor("rgb(17,34,51,0.5)").format(), "rgb(17 34 51/0.5)");
  equal(parseColor("rgba(17,34,51,0.5)").format(), "rgb(17 34 51/0.5)");

  equal(parseColor("rgb(6.66%,13.33%,20%)").format(), "rgb(17 34 51)");
  equal(parseColor("rgb(6.66%,13.33%,20%,50%)").format(), "rgb(17 34 51/0.5)");
  equal(parseColor("rgba(6.66%,13.33%,20%,50%)").format(), "rgb(17 34 51/0.5)");
});

test("hsl", () => {
  equal(parseColor("hsl(none none none)").format(), "hsl(0 0% 0%)");
  equal(parseColor("hsl(none none none/none)").format(), "hsl(0 0% 0%)");

  equal(parseColor("hsl(180 10 20)").format(), "hsl(180 10% 20%)");
  equal(parseColor("hsl(180 10 20/0.5)").format(), "hsl(180 10% 20%/0.5)");
  equal(parseColor("hsla(180 10 20/0.5)").format(), "hsl(180 10% 20%/0.5)");

  equal(parseColor("hsl(180 10% 20%)").format(), "hsl(180 10% 20%)");
  equal(parseColor("hsl(180 10% 20%/0.5)").format(), "hsl(180 10% 20%/0.5)");
  equal(parseColor("hsla(180 10% 20%/0.5)").format(), "hsl(180 10% 20%/0.5)");
});

test("legacy hsl", () => {
  equal(parseColor("hsl(180,40%,30%)").format(), "hsl(180 40% 30%)");
  equal(parseColor("hsl(180,40%,30%,0.5)").format(), "hsl(180 40% 30%/0.5)");
  equal(parseColor("hsla(180,40%,30%,0.5)").format(), "hsl(180 40% 30%/0.5)");
});

test("hwb", () => {
  equal(parseColor("hwb(none none none)").format(), "hwb(0 0% 0%)");
  equal(parseColor("hwb(none none none/none)").format(), "hwb(0 0% 0%)");

  equal(parseColor("hwb(180 10 20)").format(), "hwb(180 10% 20%)");
  equal(parseColor("hwb(180 10 20/0.5)").format(), "hwb(180 10% 20%/0.5)");

  equal(parseColor("hwb(180 10% 20%)").format(), "hwb(180 10% 20%)");
  equal(parseColor("hwb(180 10% 20%/0.5)").format(), "hwb(180 10% 20%/0.5)");
});

test("oklab", () => {
  equal(parseColor("oklab(none none none)").format(), "oklab(0 0 0)");
  equal(parseColor("oklab(none none none/none)").format(), "oklab(0 0 0)");
  equal(parseColor("oklab(0 0 0)").format(), "oklab(0 0 0)");
  equal(parseColor("oklab(0 0 0/0)").format(), "oklab(0 0 0/0)");
  equal(parseColor("oklab(0% 0% 0%)").format(), "oklab(0 0 0)");
  equal(parseColor("oklab(0% 0% 0%/0%)").format(), "oklab(0 0 0/0)");
  equal(parseColor("oklab(0.5 0.2 0.2)").format(), "oklab(0.5 0.2 0.2)");
  equal(parseColor("oklab(0.5 -0.2 -0.2)").format(), "oklab(0.5 -0.2 -0.2)");
  equal(parseColor("oklab(50% 50% 50%)").format(), "oklab(0.5 0.2 0.2)");
  equal(parseColor("oklab(50% -50% -50%)").format(), "oklab(0.5 -0.2 -0.2)");
  equal(parseColor("oklab(1 0.4 0.4)").format(), "oklab(1 0.4 0.4)");
  equal(parseColor("oklab(1 -0.4 -0.4)").format(), "oklab(1 -0.4 -0.4)");
  equal(parseColor("oklab(100% 100% 100%)").format(), "oklab(1 0.4 0.4)");
  equal(parseColor("oklab(100% -100% -100%)").format(), "oklab(1 -0.4 -0.4)");
  equal(parseColor("oklab(2 1 1)").format(), "oklab(1 0.4 0.4)");
  equal(parseColor("oklab(2 -1 -1)").format(), "oklab(1 -0.4 -0.4)");
  equal(parseColor("oklab(200% 200% 200%)").format(), "oklab(1 0.4 0.4)");
  equal(parseColor("oklab(200% -200% -200%)").format(), "oklab(1 -0.4 -0.4)");
});

test("oklch", () => {
  equal(parseColor("oklch(none none none)").format(), "oklch(0 0 0)");
  equal(parseColor("oklch(none none none/none)").format(), "oklch(0 0 0)");
  equal(parseColor("oklch(0 0 0)").format(), "oklch(0 0 0)");
  equal(parseColor("oklch(0 0 0/0)").format(), "oklch(0 0 0/0)");
  equal(parseColor("oklch(0% 0% 0%)").format(), "oklch(0 0 0)");
  equal(parseColor("oklch(0% 0% 0%/0%)").format(), "oklch(0 0 0/0)");
  equal(parseColor("oklch(0.5 0.2 180)").format(), "oklch(0.5 0.2 180)");
  equal(parseColor("oklch(50% 50% 50%)").format(), "oklch(0.5 0.2 180)");
  equal(parseColor("oklch(1 0.4 360)").format(), "oklch(1 0.4 360)");
  equal(parseColor("oklch(100% 100% 100%)").format(), "oklch(1 0.4 360)");
  equal(parseColor("oklch(2 1 360)").format(), "oklch(1 0.4 360)");
  equal(parseColor("oklch(200% 200% 360)").format(), "oklch(1 0.4 360)");
  equal(parseColor("oklch(-1 -100% -360)").format(), "oklch(0 0 0)");
});

test("whitespace", () => {
  equal(parseColor("  #123  ").toRgb().format(), "rgb(17 34 51)");
  equal(parseColor("  rgb(  1  2  3  )  ").format(), "rgb(1 2 3)");
  equal(parseColor("  rgb(  1 , 2 , 3  )  ").format(), "rgb(1 2 3)");
  equal(parseColor("  hsl(  1  2%  3%  )  ").format(), "hsl(1 2% 3%)");
  equal(parseColor("  hsl(  1 , 2% , 3%  )  ").format(), "hsl(1 2% 3%)");
  equal(parseColor("  hwb(  1  2%  3%  )  ").format(), "hwb(1 2% 3%)");
});
