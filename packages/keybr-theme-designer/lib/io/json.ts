import { type CustomTheme, themeProps, themePropsMap } from "@keybr/themes";
import { type ImportState } from "./import-state.ts";

export const themeJson = "theme.json";

export async function themeToJson(theme: CustomTheme) {
  const entries: Array<[PropertyKey, unknown]> = [];
  for (const prop of themeProps) {
    const type = themePropsMap[prop];
    const value = theme.get(prop);
    if (value != null) {
      entries.push([prop, await type.format(value)]);
    }
  }
  return JSON.stringify(Object.fromEntries(entries));
}

export async function jsonToTheme(state: ImportState, json: string) {
  let data: Record<string, any>;
  try {
    data = JSON.parse(json);
  } catch (er) {
    state.error(new TypeError("Invalid theme JSON text", { cause: er }));
    return;
  }
  if (data == null || typeof data !== "object" || Array.isArray(data)) {
    state.error(new TypeError("Invalid theme JSON data"));
    return;
  }
  for (const prop of themeProps) {
    const type = themePropsMap[prop];
    const value = data[prop];
    if (value != null) {
      if (typeof value !== "string") {
        state.error(
          new TypeError(`Invalid theme JSON property value [${prop}]`),
        );
        continue;
      }
      try {
        state.set(prop, await type.parse(value));
      } catch {
        state.error(
          new TypeError(`Invalid theme JSON property value [${prop}]`),
        );
        continue;
      }
    }
  }
}
