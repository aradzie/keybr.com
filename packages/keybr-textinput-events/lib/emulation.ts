import { type Keyboard, KeyModifier } from "@keybr/keyboard";
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
      if (codePoint > 0x0000) {
        const { ctrlKey, altKey, metaKey, timeStamp } = mapped;
        if (!(ctrlKey || altKey || metaKey)) {
          target.onTextInput({
            timeStamp,
            inputType: "appendChar",
            codePoint,
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
        case "appendChar":
          if (event.codePoint === 0x0020) {
            target.onTextInput(event);
          }
          break;
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
): [number, KeyEvent] {
  const characters = layout.getCharacters(code);
  let codePoint = 0x0000;
  if (characters != null) {
    codePoint = characters.getCodePoint(KeyModifier.from({ shiftKey, altKey }));
    if (codePoint > 0x0000) {
      key = String.fromCodePoint(codePoint);
    }
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
