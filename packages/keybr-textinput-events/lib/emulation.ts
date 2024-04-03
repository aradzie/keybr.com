import { type Keyboard, KeyModifier } from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import {
  type KeyEvent,
  type TextInputEvent,
  type TextInputListener,
} from "./types.ts";

export function emulateLayout(
  keyboard: Keyboard,
  target: TextInputListener,
  emulate: boolean,
): TextInputListener {
  if (keyboard.layout.emulate && emulate) {
    return newLayoutEmulator(keyboard, target);
  } else {
    return target;
  }
}

export function newLayoutEmulator(
  keyboard: Keyboard,
  target: TextInputListener,
): TextInputListener {
  return {
    onKeyDown: (event: KeyEvent): void => {
      const [codePoint, mapped] = remap(keyboard, event);
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
      const [codePoint, mapped] = remap(keyboard, event);
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
  }: KeyEvent,
): [CodePoint, KeyEvent] {
  let codePoint = 0x0000;
  const characters = layout.getCharacters(code);
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
