import { type GeometryDict } from "../types.ts";

export const MATRIX: GeometryDict = {
  // ---
  Equal: {
    x: 0,
    y: 0,
    w: 1.5,
    h: 1,
    zones: ["pinky", "left", "digit"],
  },
  Digit1: {
    x: 1.5,
    y: 0,
    zones: ["pinky", "left", "digit"],
  },
  Digit2: {
    x: 2.5,
    y: 0,
    zones: ["ring", "left", "digit"],
  },
  Digit3: {
    x: 3.5,
    y: 0,
    zones: ["middle", "left", "digit"],
  },
  Digit4: {
    x: 4.5,
    y: 0,
    zones: ["leftIndex", "left", "digit"],
  },
  Digit5: {
    x: 5.5,
    y: 0,
    zones: ["leftIndex", "left", "digit"],
  },
  Digit6: {
    x: 7.5,
    y: 0,
    zones: ["rightIndex", "right", "digit"],
  },
  Digit7: {
    x: 8.5,
    y: 0,
    zones: ["rightIndex", "right", "digit"],
  },
  Digit8: {
    x: 9.5,
    y: 0,
    zones: ["middle", "right", "digit"],
  },
  Digit9: {
    x: 10.5,
    y: 0,
    zones: ["ring", "right", "digit"],
  },
  Digit0: {
    x: 11.5,
    y: 0,
    zones: ["pinky", "right", "digit"],
  },
  Minus: {
    x: 12.5,
    y: 0,
    w: 1.5,
    h: 1,
    zones: ["pinky", "right", "digit"],
  },
  // ---
  Tab: {
    x: 0,
    y: 1,
    w: 1.5,
    h: 1,
    labels: [{ text: "Tab" }],
    zones: ["pinky", "left", "top"],
  },
  KeyQ: {
    x: 1.5,
    y: 1,
    zones: ["pinky", "left", "top"],
  },
  KeyW: {
    x: 2.5,
    y: 1,
    zones: ["ring", "left", "top"],
  },
  KeyE: {
    x: 3.5,
    y: 1,
    zones: ["middle", "left", "top"],
  },
  KeyR: {
    x: 4.5,
    y: 1,
    zones: ["leftIndex", "left", "top"],
  },
  KeyT: {
    x: 5.5,
    y: 1,
    zones: ["leftIndex", "left", "top"],
  },
  KeyY: {
    x: 7.5,
    y: 1,
    zones: ["rightIndex", "right", "top"],
  },
  KeyU: {
    x: 8.5,
    y: 1,
    zones: ["rightIndex", "right", "top"],
  },
  KeyI: {
    x: 9.5,
    y: 1,
    zones: ["middle", "right", "top"],
  },
  KeyO: {
    x: 10.5,
    y: 1,
    zones: ["ring", "right", "top"],
  },
  KeyP: {
    x: 11.5,
    y: 1,
    zones: ["pinky", "right", "top"],
  },
  Backslash: {
    x: 12.5,
    y: 1,
    w: 1.5,
    h: 1,
    zones: ["pinky", "right", "top"],
  },
  // ---
  CapsLock: {
    x: 0,
    y: 2,
    w: 1.5,
    h: 1,
    labels: [{ text: "Caps Lock" }],
    zones: ["pinky", "left", "home"],
  },
  KeyA: {
    x: 1.5,
    y: 2,
    zones: ["pinky", "left", "home"],
  },
  KeyS: {
    x: 2.5,
    y: 2,
    zones: ["ring", "left", "home"],
  },
  KeyD: {
    x: 3.5,
    y: 2,
    zones: ["middle", "left", "home"],
  },
  KeyF: {
    x: 4.5,
    y: 2,
    zones: ["leftIndex", "left", "home"],
    homing: true,
  },
  KeyG: {
    x: 5.5,
    y: 2,
    zones: ["leftIndex", "left", "home"],
  },
  KeyH: {
    x: 7.5,
    y: 2,
    zones: ["rightIndex", "right", "home"],
  },
  KeyJ: {
    x: 8.5,
    y: 2,
    zones: ["rightIndex", "right", "home"],
    homing: true,
  },
  KeyK: {
    x: 9.5,
    y: 2,
    zones: ["middle", "right", "home"],
  },
  KeyL: {
    x: 10.5,
    y: 2,
    zones: ["ring", "right", "home"],
  },
  Semicolon: {
    x: 11.5,
    y: 2,
    zones: ["pinky", "right", "home"],
  },
  Quote: {
    x: 12.5,
    y: 2,
    w: 1.5,
    h: 1,
    zones: ["pinky", "right", "home"],
  },
  // ---
  ShiftLeft: {
    x: 0,
    y: 3,
    w: 1.5,
    h: 1,
    labels: [{ text: "Shift" }],
    zones: ["pinky", "left", "bottom"],
  },
  KeyZ: {
    x: 1.5,
    y: 3,
    zones: ["pinky", "left", "bottom"],
  },
  KeyX: {
    x: 2.5,
    y: 3,
    zones: ["ring", "left", "bottom"],
  },
  KeyC: {
    x: 3.5,
    y: 3,
    zones: ["middle", "left", "bottom"],
  },
  KeyV: {
    x: 4.5,
    y: 3,
    zones: ["leftIndex", "left", "bottom"],
  },
  KeyB: {
    x: 5.5,
    y: 3,
    zones: ["leftIndex", "left", "bottom"],
  },
  KeyN: {
    x: 7.5,
    y: 3,
    zones: ["rightIndex", "right", "bottom"],
  },
  KeyM: {
    x: 8.5,
    y: 3,
    zones: ["rightIndex", "right", "bottom"],
  },
  Comma: {
    x: 9.5,
    y: 3,
    zones: ["middle", "right", "bottom"],
  },
  Period: {
    x: 10.5,
    y: 3,
    zones: ["ring", "right", "bottom"],
  },
  Slash: {
    x: 11.5,
    y: 3,
    zones: ["pinky", "right", "bottom"],
  },
  ShiftRight: {
    x: 12.5,
    y: 3,
    w: 1.5,
    labels: [{ text: "Shift" }],
    zones: ["pinky", "right", "bottom"],
  },
  ThumbClusterLeft1: {
    x: 4.5,
    y: 4,
    zones: ["thumb", "left", "bottom"],
  },
  ThumbClusterLeft2: {
    x: 5.5,
    y: 4,
    zones: ["thumb", "left", "bottom"],
  },
  ThumbClusterRight1: {
    x: 7.5,
    y: 4,
    zones: ["thumb", "right", "bottom"],
  },
  ThumbClusterRight2: {
    x: 8.5,
    y: 4,
    zones: ["thumb", "right", "bottom"],
  },
};
