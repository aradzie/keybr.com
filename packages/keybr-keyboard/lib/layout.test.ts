import test from "ava";
import { Layout } from "./layout.ts";

test("find layout", (t) => {
  t.is(Layout.findLayout(""), null);
  t.is(Layout.findLayout("xyz"), null);
  t.is(Layout.findLayout("xy-yy"), null);

  t.is(Layout.findLayout("en"), Layout.EN_US);
  t.is(Layout.findLayout("en-US"), Layout.EN_US);
  t.is(Layout.findLayout("en-XX"), Layout.EN_US);

  t.is(Layout.findLayout("fr"), Layout.FR_FR);
  t.is(Layout.findLayout("fr-FR"), Layout.FR_FR);
  t.is(Layout.findLayout("fr-CA"), Layout.FR_CA);
  t.is(Layout.findLayout("fr-XX"), Layout.FR_FR);
});
