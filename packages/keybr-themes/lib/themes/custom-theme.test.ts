import test from "ava";
import { DataUrlAsset } from "./asset.ts";
import { Color } from "./color.ts";
import { CustomTheme } from "./custom-theme.ts";

test("theme", (t) => {
  const white = Color.parse("#ffffff");
  const black = Color.parse("#000000");
  const asset = new DataUrlAsset(
    new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>'], {
      type: "image/svg+xml",
    }),
  );

  const a = new CustomTheme();
  const b = a.set("--primary", white);
  const c = b.set("--primary", black).set("--background-image", asset);

  t.not(a, b);
  t.not(b, c);
  t.not(a, c);

  t.deepEqual([...a], []);
  t.deepEqual(
    [...b],
    [
      ["--primary", white], //
    ],
  );
  t.deepEqual(
    [...c],
    [
      ["--primary", black], //
      ["--background-image", asset],
    ],
  );

  t.is(a.getColor("--primary"), null);
  t.is(b.getColor("--primary"), white);
  t.is(c.getColor("--primary"), black);
  t.is(c.getImage("--background-image"), asset);
});
