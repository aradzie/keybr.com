import { Color } from "./color.ts";
import { CustomTheme } from "./custom-theme.ts";
import {
  type PropName,
  type PropValue,
  themeProps,
  themePropsMap,
} from "./theme-props.ts";

export async function storeTheme(
  theme: CustomTheme,
  storage: Storage = window.localStorage,
): Promise<{ theme: CustomTheme; error: AggregateError | null }> {
  let errors = [];
  for (const prop of themeProps) {
    const key = storedPropName(prop);
    const value = theme.get(prop);
    if (value != null) {
      try {
        let storedValue: string;
        switch (themePropsMap[prop].type) {
          case "color":
            storedValue = String(value);
            break;
          case "image":
            storedValue = await blobToDataUrl(value as Blob);
            break;
        }
        storage.setItem(key, storedValue);
      } catch (err) {
        theme = theme.delete(prop);
        errors.push(err);
        try {
          storage.removeItem(key);
        } catch {
          /* Ignore. */
        }
      }
    } else {
      try {
        storage.removeItem(key);
      } catch (err) {
        errors.push(err);
      }
    }
  }
  return { theme, error: collectErrors(errors) };
}

export async function readTheme(
  storage: Storage = window.localStorage,
): Promise<{ theme: CustomTheme; error: AggregateError | null }> {
  let theme = new CustomTheme();
  let errors = [];
  for (const prop of themeProps) {
    const key = storedPropName(prop);
    const storedValue = storage.getItem(key);
    if (storedValue != null) {
      try {
        let value: PropValue;
        switch (themePropsMap[prop].type) {
          case "color":
            value = Color.parse(storedValue);
            break;
          case "image":
            value = await dataUrlToBlob(storedValue);
            break;
        }
        theme = theme.set(prop, value);
      } catch (err) {
        errors.push(err);
        try {
          storage.removeItem(key);
        } catch {
          /* Ignore. */
        }
      }
    }
  }
  return { theme, error: collectErrors(errors) };
}

function storedPropName(prop: PropName): string {
  return `keybr.theme[${prop}]`;
}

function collectErrors(errors: any[]) {
  if (errors.length > 0) {
    return new AggregateError(errors);
  } else {
    return null;
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
      resolve(String(reader.result));
    });
    reader.addEventListener("error", (ev) => {
      reject(new Error());
    });
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(url: string): Promise<Blob> {
  return fetch(url).then((r) => r.blob());
}
