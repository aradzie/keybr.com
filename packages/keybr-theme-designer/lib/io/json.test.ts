import { describe, it, test } from "node:test";
import { deepEqual, like } from "rich-assert";
import { lightTheme } from "../themes/themes.ts";
import { ImportState } from "./import-state.ts";
import { jsonToTheme, themeToJson } from "./json.ts";

test("format and parse json", async () => {
  const state = new ImportState();

  await jsonToTheme(state, await themeToJson(lightTheme));

  deepEqual(state.theme, lightTheme);
  deepEqual(state.errors, []);
});

describe("parse json with errors", () => {
  it("should report invalid json syntax", async () => {
    const state = new ImportState();
    await jsonToTheme(state, "{?}");
    like(state.errors, [{ message: "Invalid theme JSON text" }]);
  });

  it("should report invalid json data", async () => {
    const state = new ImportState();
    await jsonToTheme(state, "null");
    deepEqual(state.errors, [new TypeError("Invalid theme JSON data")]);
  });

  it("should report invalid property types", async () => {
    const state = new ImportState();
    await jsonToTheme(state, '{"--primary":[]}');
    like(state.errors, [
      { message: "Invalid theme JSON property value [--primary]" },
    ]);
  });

  it("should report invalid property values", async () => {
    const state = new ImportState();
    await jsonToTheme(state, '{"--primary":"rgb()"}');
    like(state.errors, [
      { message: "Invalid theme JSON property value [--primary]" },
    ]);
  });
});
