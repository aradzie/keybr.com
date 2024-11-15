import {
  Emulation,
  type Keyboard,
  keyboardProps,
  KeyModifier,
} from "@keybr/keyboard";
import { type Settings } from "@keybr/settings";
import { type CodePoint } from "@keybr/unicode";
import { isTextInput } from "./modifiers.ts";
import { TimeToType } from "./timetotype.ts";
import {
  type IKeyboardEvent,
  type InputListener,
  type ModifierId,
} from "./types.ts";

export function emulateLayout(
  settings: Settings,
  keyboard: Keyboard,
  target: InputListener,
): InputListener {
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
  target: InputListener,
): InputListener {
  const timeToType = new TimeToType();
  return {
    onKeyDown: (event) => {
      timeToType.add(event);
      const [mapped, codePoint] = fixKey(keyboard, event);
      target.onKeyDown(mapped);
      if (isTextInput(event.modifiers) && codePoint > 0x0000) {
        target.onInput({
          type: "input",
          timeStamp: mapped.timeStamp,
          inputType: "appendChar",
          codePoint,
          timeToType: timeToType.measure(event),
        });
      }
    },
    onKeyUp: (event) => {
      timeToType.add(event);
      const [mapped, codePoint] = fixKey(keyboard, event);
      target.onKeyUp(mapped);
    },
    onInput: (event) => {
      switch (event.inputType) {
        case "appendLineBreak":
        case "clearChar":
        case "clearWord":
          target.onInput(event);
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
  target: InputListener,
): InputListener {
  return {
    onKeyDown: (event) => {
      target.onKeyDown(fixCode(keyboard, event));
    },
    onKeyUp: (event) => {
      target.onKeyUp(fixCode(keyboard, event));
    },
    onInput: (event) => {
      target.onInput(event);
    },
  };
}

/**
 * Changes the character code using a physical key location.
 */
function fixKey(
  keyboard: Keyboard,
  { type, timeStamp, code, key, modifiers }: IKeyboardEvent,
): [IKeyboardEvent, CodePoint] {
  let codePoint = 0x0000;
  const characters = keyboard.getCharacters(code);
  if (characters != null) {
    key = String.fromCodePoint(
      (codePoint = characters.getCodePoint(toKeyModifier(modifiers)) ?? 0x0000),
    );
  }
  return [{ type, timeStamp, code, key, modifiers }, codePoint];
}

/**
 * Changes the physical key location using a character code.
 */
function fixCode(
  keyboard: Keyboard,
  { type, timeStamp, code, key, modifiers }: IKeyboardEvent,
): IKeyboardEvent {
  if (key.length === 1) {
    const combo = keyboard.getCombo(key.codePointAt(0) ?? 0x0000);
    if (combo != null) {
      code = combo.id;
    }
  }
  return { type, timeStamp, code, key, modifiers };
}

function toKeyModifier(modifiers: readonly ModifierId[]): KeyModifier {
  return KeyModifier.from(
    modifiers.includes("Shift"),
    modifiers.includes("AltGraph"),
  );
}
