import { type Keyboard, keyboardProps } from "@keybr/keyboard";
import { lessonProps } from "@keybr/lesson";
import { type AttemptContext } from "@keybr/recording";
import { type AnyProp, type Settings } from "@keybr/settings";
import { textInputProps } from "@keybr/textinput";
import { type RecorderOptions } from "./recorder.ts";

export function recordingContext(
  text: string,
  settings: Settings,
  keyboard: Keyboard,
  options: RecorderOptions,
): AttemptContext {
  return {
    text,
    applicationRevision: options.applicationRevision,
    board: options.board,
    keymap: options.keymap,
    settings: {
      typing: resolve(settings, textInputProps),
      exercise: resolve(settings, lessonProps),
      layout: {
        ...resolve(settings, keyboardProps),
        resolvedLayout: keyboard.layout.id,
        resolvedGeometry: keyboard.geometry.id,
      },
    },
  };
}

/** Resolve every property through Settings.get so defaults and normalization survive. */
function resolve(settings: Settings, props: object): Record<string, any> {
  const result: Record<string, any> = {};
  for (const value of Object.values(props)) {
    if ("key" in value && typeof value.toJson === "function") {
      const prop = value as AnyProp<unknown>;
      result[prop.key] = prop.toJson(settings.get(prop));
    } else Object.assign(result, resolve(settings, value));
  }
  return result;
}
