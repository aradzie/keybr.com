import { CustomTheme } from "./custom-theme.ts";
import { type PropName, themeProps, themePropsMap } from "./theme-props.ts";

export async function storeTheme(
  theme: CustomTheme,
  storage: Storage = window.localStorage,
): Promise<{ theme: CustomTheme; error: AggregateError | null }> {
  let errors = [];
  for (const prop of themeProps) {
    const type = themePropsMap[prop];
    const key = storedPropName(prop);
    const value = theme.get(prop);
    if (value != null) {
      try {
        storage.setItem(key, await type.format(value));
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
    const type = themePropsMap[prop];
    const key = storedPropName(prop);
    const value = storage.getItem(key);
    if (value != null) {
      try {
        theme = theme.set(prop, await type.parse(value));
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
