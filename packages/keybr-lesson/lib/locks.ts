import { type Letter } from "@keybr/phonetic-model";
import { type Settings } from "@keybr/settings";
import { lessonProps } from "./settings.ts";

/**
 * Parse comma-separated code points from settings into a Set.
 * @param value - Comma-separated string of code points (e.g., "97,98,99")
 * @returns Set of code points
 */
export function parseManualLocks(value: string): Set<number> {
  if (!value) {
    return new Set();
  }
  const parts = value.split(",");
  const locks = new Set<number>();
  for (const part of parts) {
    const codePoint = Number.parseInt(part.trim(), 10);
    if (!Number.isNaN(codePoint)) {
      locks.add(codePoint);
    }
  }
  return locks;
}

/**
 * Format a Set of code points back to comma-separated string.
 * @param locks - Set of code points
 * @returns Comma-separated string (e.g., "97,98,99")
 */
export function formatManualLocks(locks: Set<number>): string {
  return [...locks].sort((a, b) => a - b).join(",");
}

/**
 * Add a key to manual locks in settings.
 * @param settings - Current settings
 * @param codePoint - Code point of the key to lock
 * @returns Updated settings
 */
export function lockKey(settings: Settings, codePoint: number): Settings {
  const locks = parseManualLocks(settings.get(lessonProps.guided.manualLocks));
  locks.add(codePoint);
  return settings.set(lessonProps.guided.manualLocks, formatManualLocks(locks));
}

/**
 * Remove a key from manual locks in settings.
 * @param settings - Current settings
 * @param codePoint - Code point of the key to unlock
 * @returns Updated settings
 */
export function unlockKey(settings: Settings, codePoint: number): Settings {
  const locks = parseManualLocks(settings.get(lessonProps.guided.manualLocks));
  locks.delete(codePoint);
  return settings.set(lessonProps.guided.manualLocks, formatManualLocks(locks));
}

/**
 * Lock all keys except the minimum required (first 6 keys).
 * This recreates the initial state while keeping typing history.
 * @param letters - All available letters
 * @returns Formatted string for settings
 */
export function lockAllKeys(letters: readonly Letter[]): string {
  const minSize = 6;
  const locks = new Set<number>();
  for (let i = minSize; i < letters.length; i++) {
    locks.add(letters[i].codePoint);
  }
  return formatManualLocks(locks);
}
