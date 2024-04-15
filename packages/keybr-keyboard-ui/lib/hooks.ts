import { type KeyId } from "@keybr/keyboard";
import { useWindowEvent } from "@keybr/widget";
import { useState } from "react";

export function addKey(keys: readonly KeyId[], key: KeyId): readonly KeyId[] {
  const set = new Set(keys);
  set.add(key);
  return [...keys];
}

export function deleteKey(
  keys: readonly KeyId[],
  key: KeyId,
): readonly KeyId[] {
  const set = new Set(keys);
  set.delete(key);
  return [...keys];
}

export function useDepressedKeys(): readonly KeyId[] {
  const [depressedKeys, setDepressedKeys] = useState<readonly KeyId[]>([]);
  useWindowEvent("keydown", (ev) => {
    setDepressedKeys(addKey(depressedKeys, ev.code));
  });
  useWindowEvent("keyup", (ev) => {
    setDepressedKeys(deleteKey(depressedKeys, ev.code));
  });
  return depressedKeys;
}
