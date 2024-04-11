import test from "ava";
import { Layout } from "./layout.ts";
import { loadKeyboard } from "./load.ts";
import { type KeyId } from "./types.ts";

const keys: readonly KeyId[] = [
  // ---
  "Backquote",
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "Digit0",
  "Minus",
  "Equal",
  "IntlYen",
  "Backspace",
  // ---
  "Tab",
  "KeyQ",
  "KeyW",
  "KeyE",
  "KeyR",
  "KeyT",
  "KeyY",
  "KeyU",
  "KeyI",
  "KeyO",
  "KeyP",
  "BracketLeft",
  "BracketRight",
  "Backslash",
  "Enter",
  // ---
  "CapsLock",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyF",
  "KeyG",
  "KeyH",
  "KeyJ",
  "KeyK",
  "KeyL",
  "Semicolon",
  "Quote",
  // ---
  "ShiftLeft",
  "IntlBackslash",
  "KeyZ",
  "KeyX",
  "KeyC",
  "KeyV",
  "KeyB",
  "KeyN",
  "KeyM",
  "Comma",
  "Period",
  "Slash",
  "IntlRo",
  "ShiftRight",
  // ---
  "CtrlLeft",
  "AltLeft",
  "Space",
  "AltRight",
  "CtrlRight",
];

for (const layout of Layout.ALL) {
  for (const geometry of layout.geometries) {
    test(`load layout ${layout.id}/${geometry.id}`, (t) => {
      const keyboard = loadKeyboard(layout, geometry);
      t.true(
        keyboard.getCodePoints({
          dead: false,
          shift: false,
          alt: false,
        }).size > 0,
      );
      t.true(
        keyboard.getCodePoints({
          dead: true,
          shift: true,
          alt: true,
        }).size > 0,
      );
      t.true(keyboard.getExampleText().length > 0);
      t.true(keyboard.getExampleLetters().length > 0);

      for (const key of keys) {
        const shape = keyboard.getShape(key);
        if (shape != null) {
          if (shape.finger == null) {
            t.fail(`Key ${key} is not assigned a finger zone`);
          }
          if (shape.hand == null) {
            t.fail(`Key ${key} is not assigned a hand zone`);
          }
          if (shape.row == null) {
            t.fail(`Key ${key} is not assigned a row zone`);
          }
        }
      }
    });
  }
}
