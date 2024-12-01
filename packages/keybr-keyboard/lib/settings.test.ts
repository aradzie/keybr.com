import { describe, it, test } from "node:test";
import { Settings } from "@keybr/settings";
import { equal, isNotEmpty } from "rich-assert";
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
      .set(keyboardProps.language, Language.IT)
      .set(keyboardProps.layout, Layout.IT_IT)
      .set(keyboardProps.geometry, Geometry.ISO_102)
      .set(keyboardProps.zones, ZoneMod.SYMMETRIC),
  );

  equal(options.language, Language.IT);
  equal(options.layout, Layout.IT_IT);
  equal(options.geometry, Geometry.ISO_102);
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

  it("mix language and layout", () => {
    const options = KeyboardOptions.default()
      .withLanguage(Language.FR)
      .withLayout(Layout.EN_DVORAK);

    equal(options.language, Language.FR);
    equal(options.layout, Layout.EN_DVORAK);
  });

  it("reject invalid language and layout combination", () => {
    const options = KeyboardOptions.default()
      .withLanguage(Language.FR)
      .withLayout(Layout.EL_GR);

    equal(options.language, Language.FR);
    equal(options.layout, Layout.FR_FR);
  });
});

test("find layouts for all languages", () => {
  for (const language of Language.ALL) {
    const options = KeyboardOptions.default().withLanguage(language);
    equal(options.language, language);
    equal(options.layout.language.script, language.script);
    isNotEmpty(options.selectableLayouts());
  }
});
