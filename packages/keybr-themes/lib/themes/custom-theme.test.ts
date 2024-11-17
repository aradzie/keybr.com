import { test } from "node:test";
import { parseColor } from "@keybr/color";
import { assert } from "chai";
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

  assert.notStrictEqual(a, b);
  assert.notStrictEqual(b, c);
  assert.notStrictEqual(a, c);

  assert.strictEqual(a.hash(), a.hash());
  assert.strictEqual(b.hash(), b.hash());
  assert.strictEqual(c.hash(), c.hash());

  assert.notStrictEqual(a.hash(), b.hash());
  assert.notStrictEqual(b.hash(), c.hash());
  assert.notStrictEqual(a.hash(), c.hash());

  assert.deepStrictEqual([...a], []);
  assert.deepStrictEqual(
    [...b],
    [
      ["--primary", white], //
    ],
  );
  assert.deepStrictEqual(
    [...c],
    [
      ["--primary", black], //
      ["--background-image", asset],
    ],
  );

  assert.strictEqual(a.getColor("--primary"), null);
  assert.strictEqual(b.getColor("--primary"), white);
  assert.strictEqual(c.getColor("--primary"), black);
  assert.strictEqual(c.getImage("--background-image"), asset);
});
