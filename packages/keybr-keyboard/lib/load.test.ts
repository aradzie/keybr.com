import { test } from "node:test";
import { equal, fail, isTrue } from "rich-assert";
import { Geometry } from "./geometry.ts";
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
    test(`load layout ${layout.id}/${geometry.id}`, () => {
      const keyboard = loadKeyboard(layout, geometry);
      isTrue(
        keyboard.getCodePoints({
          dead: false,
          shift: false,
          alt: false,
        }).size > 0,
      );
      isTrue(
        keyboard.getCodePoints({
          dead: true,
          shift: true,
          alt: true,
        }).size > 0,
      );
      isTrue(keyboard.getExampleText().length > 0);
      isTrue(keyboard.getExampleLetters().length > 0);

      for (const key of keys) {
        const shape = keyboard.getShape(key);
        if (shape != null) {
          if (shape.finger == null) {
            fail(`Key ${key} is not assigned a finger zone`);
          }
          if (shape.hand == null) {
            fail(`Key ${key} is not assigned a hand zone`);
          }
          if (shape.row == null) {
            fail(`Key ${key} is not assigned a row zone`);
          }
        }
      }
    });
  }
}

test("load Ukrainian legacy classic layout", () => {
  const ansi = loadKeyboard(Layout.UK_UA_LEGACY_CLASSIC, Geometry.ANSI_101);
  equal(ansi.getCombo(/* "ʼ" */ 0x02bc)?.id, "Backquote");
  equal(ansi.getCombo(/* "ґ" */ 0x0491)?.id, "Backslash");
  equal(ansi.getCombo(/* "/" */ 0x002f)?.id, "Slash");

  const iso = loadKeyboard(Layout.UK_UA_LEGACY_CLASSIC, Geometry.ISO_102);
  equal(iso.getCombo(/* ">" */ 0x003e)?.id, "Backquote");
  equal(iso.getCombo(/* "ʼ" */ 0x02bc)?.id, "IntlBackslash");
  equal(iso.getCombo(/* "ґ" */ 0x0491)?.id, "Backslash");
  equal(iso.getCombo(/* "/" */ 0x002f)?.id, "Slash");
});

test("load Ukrainian layout", () => {
  const keyboard = loadKeyboard(Layout.UK_UA, Geometry.ANSI_101);

  equal(keyboard.getCombo(/* "ґ" */ 0x0491)?.id, "Backquote");
  equal(keyboard.getCombo(/* "Ґ" */ 0x0490)?.id, "Backquote");
  equal(keyboard.getCombo(/* "ʼ" */ 0x02bc)?.id, "Backslash");

  const iso = loadKeyboard(Layout.UK_UA, Geometry.ISO_102);
  equal(iso.getCombo(/* "\" */ 0x005c)?.id, "Backquote");
  equal(iso.getCombo(/* "ʼ" */ 0x02bc)?.id, "Backslash");
  equal(iso.getCombo(/* "ґ" */ 0x0491)?.id, "IntlBackslash");
});
