import {
  Emulation,
  type Keyboard,
  keyboardProps,
  KeyModifier,
} from "@keybr/keyboard";
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
    switch (settings.get(keyboardProps.emulation)) {
      case Emulation.Forward:
        return forwardEmulation(keyboard, target);
      case Emulation.Reverse:
        return reverseEmulation(keyboard, target);
    }
  }
  return target;
}

/**
 * Expects the `code` property to be correct, changes the `key` property.
 *
 * We ignore the character codes reported by the OS and use our own layout
 * tables to translate a physical key location to a character code.
 *
 * It is a convenience option that allows users not to care about the OS
 * settings.
 */
function forwardEmulation(
  keyboard: Keyboard,
  target: TextInputListener,
): TextInputListener {
  return {
    onKeyDown: (event: KeyEvent): void => {
      const [codePoint, mapped] = fixKey(keyboard, event);
      target.onKeyDown(mapped);
      const { ctrlKey, altKey, metaKey, timeStamp } = mapped;
      if (!(ctrlKey || altKey || metaKey)) {
        if (codePoint > 0x0000) {
          target.onTextInput({
            timeStamp,
            inputType: "appendChar",
            codePoint,
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
        case "appendLineBreak":
        case "clearChar":
        case "clearWord":
          target.onTextInput(event);
          break;
      }
    },
  };
}

/**
 * Expects the `key` property to be correct, changes the `code` property.
 *
 * Keyboard layout switching is done in hardware. It changes physical key
 * locations to the QWERTY equivalents. So if the A key is pressed in a custom
 * keyboard layout, the hardware will send the physical key location of the A
 * letter in the QWERTY layout.
 *
 * We use a layout table and a character code as reported by the OS to fix
 * the physical key location.
 */
function reverseEmulation(
  keyboard: Keyboard,
  target: TextInputListener,
): TextInputListener {
  return {
    onKeyDown: (event: KeyEvent): void => {
      target.onKeyDown(fixCode(keyboard, event));
    },
    onKeyUp: (event: KeyEvent): void => {
      target.onKeyUp(fixCode(keyboard, event));
    },
    onTextInput: (event: TextInputEvent): void => {
      target.onTextInput(event);
    },
  };
}

/**
 * Changes the character code using a physical key location.
 */
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

/**
 * Changes the physical key location using a character code.
 */
function fixCode(
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
): KeyEvent {
  if (key.length === 1) {
    const combo = keyboard.getCombo(key.codePointAt(0) ?? 0x0000);
    if (combo != null) {
      code = combo.id;
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
  };
}
