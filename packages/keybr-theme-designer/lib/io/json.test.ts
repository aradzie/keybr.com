import { describe, it, test } from "node:test";
import { assert } from "chai";
import { lightTheme } from "../themes/themes.ts";
import { ImportState } from "./import-state.ts";
import { jsonToTheme, themeToJson } from "./json.ts";

test("format and parse json", async () => {
  const state = new ImportState();

  await jsonToTheme(state, await themeToJson(lightTheme));

  assert.deepStrictEqual(state.theme, lightTheme);
  assert.deepStrictEqual(state.errors, []);
});

describe("parse json with errors", () => {
  it("should report invalid json syntax", async () => {
    const state = new ImportState();
    await jsonToTheme(state, "{?}");
    assert.deepStrictEqual(state.errors, [
      new TypeError("Invalid theme JSON text"),
    ]);
  });

  it("should report invalid json data", async () => {
    const state = new ImportState();
    await jsonToTheme(state, "null");
    assert.deepStrictEqual(state.errors, [
      new TypeError("Invalid theme JSON data"),
    ]);
  });

  it("should report invalid property types", async () => {
    const state = new ImportState();
    await jsonToTheme(state, '{"--primary":[]}');
    assert.deepStrictEqual(state.errors, [
      new TypeError("Invalid theme JSON property value [--primary]"),
    ]);
  });

  it("should report invalid property values", async () => {
    const state = new ImportState();
    await jsonToTheme(state, '{"--primary":"rgb()"}');
    assert.deepStrictEqual(state.errors, [
      new TypeError("Invalid theme JSON property value [--primary]"),
    ]);
  });
});
