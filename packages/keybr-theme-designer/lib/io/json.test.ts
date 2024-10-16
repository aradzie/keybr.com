import { lightTheme } from "@keybr/themes";
import test from "ava";
import { ImportState } from "./import-state.ts";
import { jsonToTheme, themeToJson } from "./json.ts";

test("format and parse json", async (t) => {
  const state = new ImportState();

  await jsonToTheme(state, await themeToJson(lightTheme));

  t.deepEqual(state.theme, lightTheme);
  t.deepEqual(state.errors, []);
});

test("parse json with errors", async (t) => {
  {
    const state = new ImportState();
    await jsonToTheme(state, "{?}");
    t.deepEqual(state.errors, [new TypeError("Invalid theme JSON text")]);
  }
  {
    const state = new ImportState();
    await jsonToTheme(state, "null");
    t.deepEqual(state.errors, [new TypeError("Invalid theme JSON data")]);
  }
  {
    const state = new ImportState();
    await jsonToTheme(state, '{"--primary":[]}');
    t.deepEqual(state.errors, [
      new TypeError("Invalid theme JSON property value [--primary]"),
    ]);
  }
  {
    const state = new ImportState();
    await jsonToTheme(state, '{"--primary":"rgb()"}');
    t.deepEqual(state.errors, [
      new TypeError("Invalid theme JSON property value [--primary]"),
    ]);
  }
});
