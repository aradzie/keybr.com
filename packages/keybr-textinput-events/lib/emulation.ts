import { type Keyboard, keyboardProps, KeyModifier } from "@keybr/keyboard";
import { type Settings } from "@keybr/settings";
import { type CodePoint } from "@keybr/unicode";
import {
  type KeyEvent,
  type TextInputEvent,
  type TextInputListener,
} from "./types.ts";

export function emulateLayout(
  settings: Settings,
  keyboard: Keyboard,
  target: TextInputListener,
): TextInputListener {
  if (keyboard.layout.emulate) {
    if (settings.get(keyboardProps.emulate)) {
      return emulateForward(keyboard, target);
    }
  }
  return target;
}

function emulateForward(
  keyboard: Keyboard,
  target: TextInputListener,
): TextInputListener {
  return {
    onKeyDown: (event: KeyEvent): void => {
      const [codePoint, mapped] = fixKey(keyboard, event);
      target.onKeyDown(mapped);
      const { key, ctrlKey, altKey, metaKey, timeStamp } = mapped;
      if (!(ctrlKey || altKey || metaKey)) {
        if (codePoint > 0x0000) {
          target.onTextInput({
            timeStamp,
            inputType: "appendChar",
            codePoint,
          });
        } else if (key === "Enter") {
          target.onTextInput({
            timeStamp,
            inputType: "appendChar",
            codePoint: 0x0020,
          });
        }
      }
    },
    onKeyUp: (event: KeyEvent): void => {
      const [codePoint, mapped] = fixKey(keyboard, event);
      target.onKeyUp(mapped);
    },
    onTextInput: (event: TextInputEvent): void => {
      switch (event.inputType) {
        case "clearChar":
        case "clearWord":
          target.onTextInput(event);
          break;
      }
    },
  };
}

function fixKey(
  keyboard: Keyboard,
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
  }: KeyEvent,
): [CodePoint, KeyEvent] {
  let codePoint = 0x0000;
  const characters = keyboard.getCharacters(code);
  if (characters != null) {
    key = String.fromCodePoint(
      (codePoint = characters.getCodePoint(
        KeyModifier.from({ shiftKey, altKey }),
      )),
    );
  }
  return [
    codePoint,
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
    },
  ];
}
