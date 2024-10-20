import test from "ava";
import { Asset, DataUrlAsset, UrlAsset } from "./asset.ts";

test("parse url", async (t) => {
  const asset = await Asset.parse("/assets/image.svg");

  t.deepEqual(asset, new UrlAsset("/assets/image.svg"));
});

test("format url", async (t) => {
  const asset = new UrlAsset("/assets/image.svg");

  t.is(await asset.format(), "/assets/image.svg");
});

test("parse data url", async (t) => {
  const asset = await Asset.parse(
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=",
  );

  t.deepEqual(
    asset,
    new DataUrlAsset(
      new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>'], {
        type: "image/svg+xml",
      }),
    ),
  );
});

test("format data url", async (t) => {
  global.FileReader = window.FileReader;
  global.Blob = window.Blob;

  const asset = new DataUrlAsset(
    new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>'], {
      type: "image/svg+xml",
    }),
  );

  t.is(
    await asset.format(),
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=",
  );
});
