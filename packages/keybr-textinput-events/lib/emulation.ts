import { type Keyboard, KeyModifier } from "@keybr/keyboard";
import { Char_Backspace, Char_LineFeed, Char_Tab } from "./chars.ts";
import { type KeyEvent, type KeyEventListener } from "./types.ts";

export function emulateLayout(
  keyboard: Keyboard,
  target: KeyEventListener,
  emulate: boolean,
): KeyEventListener {
  if (keyboard.layout.emulate && emulate) {
    return newLayoutEmulator(keyboard, target);
  } else {
    return target;
  }
}

export function newLayoutEmulator(
  keyboard: Keyboard,
  target: KeyEventListener,
): KeyEventListener {
  return {
    onKeyDown: (event: KeyEvent): void => {
      const mapped = remap(keyboard, event);
      target.onKeyDown(mapped);
      const { ctrlKey, altKey, metaKey, key, timeStamp } = mapped;
      if (!(ctrlKey || altKey || metaKey)) {
        switch (key) {
          case "Backspace":
            target.onInput(Char_Backspace, timeStamp);
            break;
          case "Tab":
            target.onInput(Char_Tab, timeStamp);
            break;
          case "Enter":
            target.onInput(Char_LineFeed, timeStamp);
            break;
          default: {
            if (key.length === 1) {
              target.onInput(key.codePointAt(0) ?? 0, timeStamp);
            }
            break;
          }
        }
      }
    },
    onKeyUp: (event: KeyEvent): void => {
      const mapped = remap(keyboard, event);
      target.onKeyUp(mapped);
    },
    onInput: (codePoint: number, timeStamp: number): void => {},
  };
}

function remap(
  layout: Keyboard,
  {
    timeStamp,
    code,
    key,
    shiftKey,
    altKey,
    ctrlKey,
    metaKey,
    location,
    repeat,
    modifiers,
  }: KeyEvent,
): KeyEvent {
  const layoutKey = layout.getKey(code);
  if (layoutKey != null) {
    const codePoint = layoutKey.codePoint(KeyModifier.of({ shiftKey, altKey }));
    if (codePoint > 0) {
      key = String.fromCodePoint(codePoint);
    }
  }
  return {
    timeStamp,
    code,
    key,
    shiftKey,
    altKey,
    ctrlKey,
    metaKey,
    location,
    repeat,
    modifiers,
  };
}
