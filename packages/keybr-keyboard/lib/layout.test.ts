import { test } from "node:test";
import { equal } from "rich-assert";
import { Layout } from "./layout.ts";

test("find layout", () => {
  equal(Layout.findLayout(""), null);
  equal(Layout.findLayout("xyz"), null);
  equal(Layout.findLayout("xy-yy"), null);

  equal(Layout.findLayout("en"), Layout.EN_US);
  equal(Layout.findLayout("en-US"), Layout.EN_US);
  equal(Layout.findLayout("en-XX"), Layout.EN_US);

  equal(Layout.findLayout("fr"), Layout.FR_FR);
  equal(Layout.findLayout("fr-FR"), Layout.FR_FR);
  equal(Layout.findLayout("fr-CA"), Layout.FR_CA);
  equal(Layout.findLayout("fr-XX"), Layout.FR_FR);
});
