import { describe, it, test } from "node:test";
import { Settings } from "@keybr/settings";
import { assert } from "chai";
import { Geometry, ZoneMod } from "./geometry.ts";
import { Language } from "./language.ts";
import { Layout } from "./layout.ts";
import { KeyboardOptions, keyboardProps } from "./settings.ts";

test("use default settings", () => {
  const options = KeyboardOptions.default();

  assert.strictEqual(options.language, Language.EN);
  assert.strictEqual(options.layout, Layout.EN_US);
  assert.strictEqual(options.geometry, Geometry.ANSI_101);
  assert.strictEqual(options.zones, ZoneMod.STANDARD);
});

test("read default settings", () => {
  const options = KeyboardOptions.from(new Settings());

  assert.strictEqual(options.language, Language.EN);
  assert.strictEqual(options.layout, Layout.EN_US);
  assert.strictEqual(options.geometry, Geometry.ANSI_101);
  assert.strictEqual(options.zones, ZoneMod.STANDARD);
});

test("read configured values", () => {
  const options = KeyboardOptions.from(
    new Settings()
      .set(keyboardProps.layout, Layout.EN_JP)
      .set(keyboardProps.geometry, Geometry.ANSI_101)
      .set(keyboardProps.zones, ZoneMod.SYMMETRIC),
  );

  assert.strictEqual(options.language, Language.EN);
  assert.strictEqual(options.layout, Layout.EN_JP);
  assert.strictEqual(options.geometry, Geometry.JAPANESE_106);
  assert.strictEqual(options.zones, ZoneMod.SYMMETRIC);
});

describe("update properties", () => {
  it("with a custom language", () => {
    const options = KeyboardOptions.default().withLanguage(Language.FR);

    assert.strictEqual(options.language, Language.FR);
    assert.strictEqual(options.layout, Layout.FR_FR);
    assert.strictEqual(options.geometry, Geometry.ISO_102);
    assert.strictEqual(options.zones, ZoneMod.STANDARD);
  });

  it("with a custom language and layout", () => {
    const options = KeyboardOptions.default()
      .withLanguage(Language.FR)
      .withLayout(Layout.FR_CA);

    assert.strictEqual(options.language, Language.FR);
    assert.strictEqual(options.layout, Layout.FR_CA);
    assert.strictEqual(options.geometry, Geometry.ISO_102);
    assert.strictEqual(options.zones, ZoneMod.STANDARD);
  });

  it("with a custom language, layout and geometry", () => {
    const options = KeyboardOptions.default()
      .withLanguage(Language.FR)
      .withLayout(Layout.FR_CA)
      .withGeometry(Geometry.ANSI_101);

    assert.strictEqual(options.language, Language.FR);
    assert.strictEqual(options.layout, Layout.FR_CA);
    assert.strictEqual(options.geometry, Geometry.ANSI_101);
    assert.strictEqual(options.zones, ZoneMod.STANDARD);
  });

  it("with a custom language, layout, geometry and zones", () => {
    const options = KeyboardOptions.default()
      .withLanguage(Language.FR)
      .withLayout(Layout.FR_CA)
      .withGeometry(Geometry.ANSI_101)
      .withZones(ZoneMod.SYMMETRIC);

    assert.strictEqual(options.language, Language.FR);
    assert.strictEqual(options.layout, Layout.FR_CA);
    assert.strictEqual(options.geometry, Geometry.ANSI_101);
    assert.strictEqual(options.zones, ZoneMod.SYMMETRIC);
  });
});
