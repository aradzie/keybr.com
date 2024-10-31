import { test } from "node:test";
import { assert } from "chai";
import { Layout } from "./layout.ts";

test("find layout", () => {
  assert.strictEqual(Layout.findLayout(""), null);
  assert.strictEqual(Layout.findLayout("xyz"), null);
  assert.strictEqual(Layout.findLayout("xy-yy"), null);

  assert.strictEqual(Layout.findLayout("en"), Layout.EN_US);
  assert.strictEqual(Layout.findLayout("en-US"), Layout.EN_US);
  assert.strictEqual(Layout.findLayout("en-XX"), Layout.EN_US);

  assert.strictEqual(Layout.findLayout("fr"), Layout.FR_FR);
  assert.strictEqual(Layout.findLayout("fr-FR"), Layout.FR_FR);
  assert.strictEqual(Layout.findLayout("fr-CA"), Layout.FR_CA);
  assert.strictEqual(Layout.findLayout("fr-XX"), Layout.FR_FR);
});
