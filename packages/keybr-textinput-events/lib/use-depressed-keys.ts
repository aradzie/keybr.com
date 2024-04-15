import { type Keyboard, type KeyId } from "@keybr/keyboard";
import { type Settings } from "@keybr/settings";
import { useWindowEvent } from "@keybr/widget";
import { useState } from "react";
import { emulateLayout } from "./emulation.ts";

export function addKey(keys: readonly KeyId[], key: KeyId): readonly KeyId[] {
  const set = new Set(keys);
  set.add(key);
  return [...set];
}

export function deleteKey(
  keys: readonly KeyId[],
  key: KeyId,
): readonly KeyId[] {
  const set = new Set(keys);
  set.delete(key);
  return [...set];
}

export function useDepressedKeys(
  settings: Settings,
  keyboard: Keyboard,
): readonly KeyId[] {
  const [depressedKeys, setDepressedKeys] = useState<readonly KeyId[]>([]);
  const listener = emulateLayout(settings, keyboard, {
    onKeyDown: ({ code }) => setDepressedKeys(addKey(depressedKeys, code)),
    onKeyUp: ({ code }) => setDepressedKeys(deleteKey(depressedKeys, code)),
    onTextInput: () => {},
  });
  useWindowEvent("keydown", listener.onKeyDown);
  useWindowEvent("keyup", listener.onKeyUp);
  return depressedKeys;
}
