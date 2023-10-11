import { type KeyId } from "@keybr/keyboard";

const capsLock = "CapsLock" as const;
const numLock = "NumLock" as const;
const allModifiers: readonly KeyId[] = [capsLock, numLock];

let initialized = false;

/**
 * A static global object which track the state of the modifier keys,
 * such as `CapsLock`, `NumLock`, etc.
 */
export class ModifierState {
  private static _modifiers: readonly KeyId[] = [];

  static get modifiers(): readonly KeyId[] {
    return this._modifiers;
  }

  private static _handleKeyDown(event: KeyboardEvent): void {
    const modifiers = getModifiers(event);
    switch (event.code) {
      case capsLock:
      case numLock:
        // TODO Fill me in.
        break;
      default:
        ModifierState._modifiers = modifiers.filter((m) =>
          allModifiers.includes(m),
        );
        break;
    }
  }

  private static _handleKeyUp(event: KeyboardEvent): void {
    const modifiers = getModifiers(event);
    switch (event.code) {
      case capsLock:
      case numLock:
        // TODO Fill me in.
        break;
      default:
        ModifierState._modifiers = modifiers.filter((m) =>
          allModifiers.includes(m),
        );
        break;
    }
  }

  static initialize() {
    if (!initialized) {
      // ModifierState must receive keyboard events before any other event listener.
      window.addEventListener("keydown", ModifierState._handleKeyDown);
      window.addEventListener("keyup", ModifierState._handleKeyUp);
      initialized = true;
    }
  }
}

function getModifiers(event: KeyboardEvent): KeyId[] {
  return allModifiers.filter((m) => event.getModifierState(m));
}
