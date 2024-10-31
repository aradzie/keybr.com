import { Settings } from "@keybr/settings";
import test from "ava";
import { Geometry, ZoneMod } from "./geometry.ts";
import { Language } from "./language.ts";
import { Layout } from "./layout.ts";
import { KeyboardOptions, keyboardProps } from "./settings.ts";

test("defaults", (t) => {
  const options = KeyboardOptions.default();

  t.is(options.language, Language.EN);
  t.is(options.layout, Layout.EN_US);
  t.is(options.geometry, Geometry.ANSI_101);
  t.is(options.zones, ZoneMod.STANDARD);
});

test("from user settings", (t) => {
  {
    const options = KeyboardOptions.from(new Settings());

    t.is(options.language, Language.EN);
    t.is(options.layout, Layout.EN_US);
    t.is(options.geometry, Geometry.ANSI_101);
    t.is(options.zones, ZoneMod.STANDARD);
  }

  {
    const options = KeyboardOptions.from(
      new Settings()
        .set(keyboardProps.layout, Layout.EN_US)
        .set(keyboardProps.geometry, Geometry.ISO_102)
        .set(keyboardProps.zones, ZoneMod.STANDARD),
    );

    t.is(options.language, Language.EN);
    t.is(options.layout, Layout.EN_US);
    t.is(options.geometry, Geometry.ISO_102);
    t.is(options.zones, ZoneMod.STANDARD);
  }

  {
    const options = KeyboardOptions.from(
      new Settings()
        .set(keyboardProps.layout, Layout.EN_JP)
        .set(keyboardProps.geometry, Geometry.ANSI_101)
        .set(keyboardProps.zones, ZoneMod.SYMMETRIC),
    );

    t.is(options.language, Language.EN);
    t.is(options.layout, Layout.EN_JP);
    t.is(options.geometry, Geometry.JAPANESE_106);
    t.is(options.zones, ZoneMod.SYMMETRIC);
  }
});

test("update properties", (t) => {
  {
    const options = KeyboardOptions.default().withLanguage(Language.FR);

    t.is(options.language, Language.FR);
    t.is(options.layout, Layout.FR_FR);
    t.is(options.geometry, Geometry.ISO_102);
    t.is(options.zones, ZoneMod.STANDARD);
  }

  {
    const options = KeyboardOptions.default()
      .withLanguage(Language.FR)
      .withLayout(Layout.FR_CA);

    t.is(options.language, Language.FR);
    t.is(options.layout, Layout.FR_CA);
    t.is(options.geometry, Geometry.ISO_102);
    t.is(options.zones, ZoneMod.STANDARD);
  }

  {
    const options = KeyboardOptions.default()
      .withLanguage(Language.FR)
      .withLayout(Layout.FR_CA)
      .withGeometry(Geometry.ANSI_101);

    t.is(options.language, Language.FR);
    t.is(options.layout, Layout.FR_CA);
    t.is(options.geometry, Geometry.ANSI_101);
    t.is(options.zones, ZoneMod.STANDARD);
  }

  {
    const options = KeyboardOptions.default()
      .withLanguage(Language.FR)
      .withLayout(Layout.FR_CA)
      .withGeometry(Geometry.ANSI_101)
      .withZones(ZoneMod.SYMMETRIC);

    t.is(options.language, Language.FR);
    t.is(options.layout, Layout.FR_CA);
    t.is(options.geometry, Geometry.ANSI_101);
    t.is(options.zones, ZoneMod.SYMMETRIC);
  }
});
