import { describe, it, test } from "node:test";
import { Settings } from "@keybr/settings";
import { equal } from "rich-assert";
import { Geometry, ZoneMod } from "./geometry.ts";
import { Language } from "./language.ts";
import { Layout } from "./layout.ts";
import { KeyboardOptions, keyboardProps } from "./settings.ts";

test("use default settings", () => {
  const options = KeyboardOptions.default();

  equal(options.language, Language.EN);
  equal(options.layout, Layout.EN_US);
  equal(options.geometry, Geometry.ANSI_101);
  equal(options.zones, ZoneMod.STANDARD);
});

test("read default settings", () => {
  const options = KeyboardOptions.from(new Settings());

  equal(options.language, Language.EN);
  equal(options.layout, Layout.EN_US);
  equal(options.geometry, Geometry.ANSI_101);
  equal(options.zones, ZoneMod.STANDARD);
});

test("read configured values", () => {
  const options = KeyboardOptions.from(
    new Settings()
      .set(keyboardProps.layout, Layout.EN_JP)
      .set(keyboardProps.geometry, Geometry.ANSI_101)
      .set(keyboardProps.zones, ZoneMod.SYMMETRIC),
  );

  equal(options.language, Language.EN);
  equal(options.layout, Layout.EN_JP);
  equal(options.geometry, Geometry.JAPANESE_106);
  equal(options.zones, ZoneMod.SYMMETRIC);
});

describe("update properties", () => {
  it("with a custom language", () => {
    const options = KeyboardOptions.default().withLanguage(Language.FR);

    equal(options.language, Language.FR);
    equal(options.layout, Layout.FR_FR);
    equal(options.geometry, Geometry.ISO_102);
    equal(options.zones, ZoneMod.STANDARD);
  });

  it("with a custom language and layout", () => {
    const options = KeyboardOptions.default()
      .withLanguage(Language.FR)
      .withLayout(Layout.FR_CA);

    equal(options.language, Language.FR);
    equal(options.layout, Layout.FR_CA);
    equal(options.geometry, Geometry.ISO_102);
    equal(options.zones, ZoneMod.STANDARD);
  });

  it("with a custom language, layout and geometry", () => {
    const options = KeyboardOptions.default()
      .withLanguage(Language.FR)
      .withLayout(Layout.FR_CA)
      .withGeometry(Geometry.ANSI_101);

    equal(options.language, Language.FR);
    equal(options.layout, Layout.FR_CA);
    equal(options.geometry, Geometry.ANSI_101);
    equal(options.zones, ZoneMod.STANDARD);
  });

  it("with a custom language, layout, geometry and zones", () => {
    const options = KeyboardOptions.default()
      .withLanguage(Language.FR)
      .withLayout(Layout.FR_CA)
      .withGeometry(Geometry.ANSI_101)
      .withZones(ZoneMod.SYMMETRIC);

    equal(options.language, Language.FR);
    equal(options.layout, Layout.FR_CA);
    equal(options.geometry, Geometry.ANSI_101);
    equal(options.zones, ZoneMod.SYMMETRIC);
  });
});
