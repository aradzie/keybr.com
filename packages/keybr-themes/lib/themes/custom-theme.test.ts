import { test } from "node:test";
import { parseColor } from "@keybr/color";
import { deepEqual, equal, notEqual } from "rich-assert";
import { DataUrlAsset } from "./asset.ts";
import { CustomTheme } from "./custom-theme.ts";

test("theme", () => {
  const white = parseColor("#ffffff");
  const black = parseColor("#000000");
  const asset = new DataUrlAsset(
    new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>'], {
      type: "image/svg+xml",
    }),
  );

  const a = new CustomTheme();
  const b = a.set("--primary", white);
  const c = b.set("--primary", black).set("--background-image", asset);

  notEqual(a, b);
  notEqual(b, c);
  notEqual(a, c);

  equal(a.hash(), a.hash());
  equal(b.hash(), b.hash());
  equal(c.hash(), c.hash());

  notEqual(a.hash(), b.hash());
  notEqual(b.hash(), c.hash());
  notEqual(a.hash(), c.hash());

  deepEqual([...a], []);
  deepEqual(
    [...b],
    [
      ["--primary", white], //
    ],
  );
  deepEqual(
    [...c],
    [
      ["--primary", black], //
      ["--background-image", asset],
    ],
  );

  equal(a.getColor("--primary"), null);
  equal(b.getColor("--primary"), white);
  equal(c.getColor("--primary"), black);
  equal(c.getImage("--background-image"), asset);
});
