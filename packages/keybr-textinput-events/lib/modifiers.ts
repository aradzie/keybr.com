import { type ModifierId } from "./types.ts";

const all = [
  "CapsLock",
  "NumLock",
  "Control",
  "Shift",
  "Alt",
  "AltGraph",
  "Meta",
] satisfies ModifierId[];

let initialized = false;
let modifiers: readonly ModifierId[] = [];

/**
 * A static global object which tracks the state of the modifier keys,
 * such as `CapsLock`, `NumLock`, etc.
 */
export class ModifierState {
  static get modifiers(): readonly ModifierId[] {
    return modifiers;
  }

  static get capsLock(): boolean {
    return modifiers.includes("CapsLock");
  }

  static get numLock(): boolean {
    return modifiers.includes("NumLock");
  }

  static initialize() {
    if (!initialized) {
      // ModifierState must receive keyboard events before any other event listener.
      window.addEventListener("keydown", (event) => {
        modifiers = getModifiers(event);
      });
      window.addEventListener("keyup", (event) => {
        modifiers = getModifiers(event);
      });
      initialized = true;
    }
  }
}

export function getModifiers(event: KeyboardEvent): ModifierId[] {
  return all.filter((id) => event.getModifierState(id));
}

export function isTextInput(modifiers: readonly ModifierId[]): boolean {
  return !(
    modifiers.includes("Control") ||
    modifiers.includes("Alt") ||
    modifiers.includes("Meta")
  );
}
