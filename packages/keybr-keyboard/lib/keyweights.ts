import { type KeyId } from "./types.ts";

/**
 * Prioritizes code points in the order of keyboard keys.
 * Code points on the home row keys have the highest priority.
 * The lower the weight, the highest priority.
 */
export const keyWeights = new Map<KeyId, number>([
  // Home row.
  ["KeyA", 1],
  ["KeyS", 1],
  ["KeyD", 1],
  ["KeyF", 1],
  ["KeyG", 1],
  ["KeyH", 1],
  ["KeyJ", 1],
  ["KeyK", 1],
  ["KeyL", 1],
  ["Semicolon", 1],
  ["Quote", 1],
  // Top row.
  ["KeyQ", 2],
  ["KeyW", 2],
  ["KeyE", 2],
  ["KeyR", 2],
  ["KeyT", 2],
  ["KeyY", 2],
  ["KeyU", 2],
  ["KeyI", 2],
  ["KeyO", 2],
  ["KeyP", 2],
  ["BracketLeft", 2],
  ["BracketRight", 2],
  ["Backslash", 2],
]);
