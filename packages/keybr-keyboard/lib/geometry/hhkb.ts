import { type GeometryDict } from "../types.ts";

/**
 * Happy Hacking Keyboard Professional (HHKB Pro) — US ANSI layout.
 *
 * Compact 60% form factor with these distinctive features:
 *   - Control key is on the home row (where CapsLock usually sits).
 *   - Backspace ("Delete" on HHKB) is on row 1, right of `]`.
 *   - No dedicated arrow / navigation cluster — Fn-layer instead.
 *   - Split bottom row: two Meta + two Alt keys around a wide Space.
 *   - Backquote/Tilde lives in the top-right corner, not top-left.
 *
 * Total board width: 15 units, height: 5 rows.
 *
 * Targets the classic HHKB Pro 2 / Pro Hybrid layout (60-key).
 */
export const HHKB: GeometryDict = {
  // ─── Row 0 (digit row) — Esc + 13 keys + Backquote ────────────────────────
  Escape: {
    x: 0,
    y: 0,
    labels: [{ text: "Esc" }],
    zones: ["pinky", "left", "digit"],
  },
  Digit1: {
    x: 1,
    y: 0,
    zones: ["pinky", "left", "digit"],
  },
  Digit2: {
    x: 2,
    y: 0,
    zones: ["ring", "left", "digit"],
  },
  Digit3: {
    x: 3,
    y: 0,
    zones: ["middle", "left", "digit"],
  },
  Digit4: {
    x: 4,
    y: 0,
    zones: ["leftIndex", "left", "digit"],
  },
  Digit5: {
    x: 5,
    y: 0,
    zones: ["leftIndex", "left", "digit"],
  },
  Digit6: {
    x: 6,
    y: 0,
    zones: ["rightIndex", "right", "digit"],
  },
  Digit7: {
    x: 7,
    y: 0,
    zones: ["rightIndex", "right", "digit"],
  },
  Digit8: {
    x: 8,
    y: 0,
    zones: ["middle", "right", "digit"],
  },
  Digit9: {
    x: 9,
    y: 0,
    zones: ["ring", "right", "digit"],
  },
  Digit0: {
    x: 10,
    y: 0,
    zones: ["pinky", "right", "digit"],
  },
  Minus: {
    x: 11,
    y: 0,
    zones: ["pinky", "right", "digit"],
  },
  Equal: {
    x: 12,
    y: 0,
    zones: ["pinky", "right", "digit"],
  },
  Backslash: {
    x: 13,
    y: 0,
    zones: ["pinky", "right", "digit"],
  },
  Backquote: {
    x: 14,
    y: 0,
    zones: ["pinky", "right", "digit"],
  },

  // ─── Row 1 (top row) — Tab + QWERTY + brackets + Delete (Backspace) ───────
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
    x: 6.5,
    y: 1,
    zones: ["rightIndex", "right", "top"],
  },
  KeyU: {
    x: 7.5,
    y: 1,
    zones: ["rightIndex", "right", "top"],
  },
  KeyI: {
    x: 8.5,
    y: 1,
    zones: ["middle", "right", "top"],
  },
  KeyO: {
    x: 9.5,
    y: 1,
    zones: ["ring", "right", "top"],
  },
  KeyP: {
    x: 10.5,
    y: 1,
    zones: ["pinky", "right", "top"],
  },
  BracketLeft: {
    x: 11.5,
    y: 1,
    zones: ["pinky", "right", "top"],
  },
  BracketRight: {
    x: 12.5,
    y: 1,
    zones: ["pinky", "right", "top"],
  },
  Backspace: {
    x: 13.5,
    y: 1,
    w: 1.5,
    h: 1,
    labels: [{ text: "Delete" }],
    zones: ["pinky", "right", "top"],
  },

  // ─── Row 2 (home row) — Control (HHKB feature!) + ASDFGHJKL + ; ' + Return
  ControlLeft: {
    x: 0,
    y: 2,
    w: 1.75,
    h: 1,
    labels: [{ text: "Control" }],
    zones: ["pinky", "left", "home"],
  },
  KeyA: {
    x: 1.75,
    y: 2,
    zones: ["pinky", "left", "home"],
  },
  KeyS: {
    x: 2.75,
    y: 2,
    zones: ["ring", "left", "home"],
  },
  KeyD: {
    x: 3.75,
    y: 2,
    zones: ["middle", "left", "home"],
  },
  KeyF: {
    x: 4.75,
    y: 2,
    zones: ["leftIndex", "left", "home"],
    homing: true,
  },
  KeyG: {
    x: 5.75,
    y: 2,
    zones: ["leftIndex", "left", "home"],
  },
  KeyH: {
    x: 6.75,
    y: 2,
    zones: ["rightIndex", "right", "home"],
  },
  KeyJ: {
    x: 7.75,
    y: 2,
    zones: ["rightIndex", "right", "home"],
    homing: true,
  },
  KeyK: {
    x: 8.75,
    y: 2,
    zones: ["middle", "right", "home"],
  },
  KeyL: {
    x: 9.75,
    y: 2,
    zones: ["ring", "right", "home"],
  },
  Semicolon: {
    x: 10.75,
    y: 2,
    zones: ["pinky", "right", "home"],
  },
  Quote: {
    x: 11.75,
    y: 2,
    zones: ["pinky", "right", "home"],
  },
  Enter: {
    x: 12.75,
    y: 2,
    w: 2.25,
    h: 1,
    labels: [{ text: "Return" }],
    zones: ["pinky", "right", "home"],
  },

  // ─── Row 3 (bottom row) — Shift + ZXCVB NM ,./ + Shift + Fn ───────────────
  ShiftLeft: {
    x: 0,
    y: 3,
    w: 2.25,
    h: 1,
    labels: [{ text: "Shift" }],
    zones: ["pinky", "left", "bottom"],
  },
  KeyZ: {
    x: 2.25,
    y: 3,
    zones: ["pinky", "left", "bottom"],
  },
  KeyX: {
    x: 3.25,
    y: 3,
    zones: ["ring", "left", "bottom"],
  },
  KeyC: {
    x: 4.25,
    y: 3,
    zones: ["middle", "left", "bottom"],
  },
  KeyV: {
    x: 5.25,
    y: 3,
    zones: ["leftIndex", "left", "bottom"],
  },
  KeyB: {
    x: 6.25,
    y: 3,
    zones: ["leftIndex", "left", "bottom"],
  },
  KeyN: {
    x: 7.25,
    y: 3,
    zones: ["rightIndex", "right", "bottom"],
  },
  KeyM: {
    x: 8.25,
    y: 3,
    zones: ["rightIndex", "right", "bottom"],
  },
  Comma: {
    x: 9.25,
    y: 3,
    zones: ["middle", "right", "bottom"],
  },
  Period: {
    x: 10.25,
    y: 3,
    zones: ["ring", "right", "bottom"],
  },
  Slash: {
    x: 11.25,
    y: 3,
    zones: ["pinky", "right", "bottom"],
  },
  ShiftRight: {
    x: 12.25,
    y: 3,
    w: 1.75,
    h: 1,
    labels: [{ text: "Shift" }],
    zones: ["pinky", "right", "bottom"],
  },
  Fn: {
    x: 14,
    y: 3,
    w: 1,
    h: 1,
    labels: [{ text: "Fn" }],
    zones: ["pinky", "right", "bottom"],
  },

  // ─── Row 4 (thumb row) — split Meta/Alt around wide Space ─────────────────
  // Layout: 1.5U gap, Meta(1U), Alt(1.5U), Space(7U), Alt(1.5U), Meta(1U), 1.5U gap
  MetaLeft: {
    x: 2.5,
    y: 4,
    w: 1.5,
    h: 1,
    labels: [{ text: "◆" }],
    zones: ["thumb", "left", "bottom"],
  },
  AltLeft: {
    x: 1.5,
    y: 4,
    w: 1,
    h: 1,
    labels: [{ text: "Alt" }],
    zones: ["pinky", "left", "bottom"],
  },
  Space: {
    x: 4,
    y: 4,
    w: 7,
    h: 1,
    labels: [{ text: "Space" }],
    zones: ["thumb", "left", "bottom"],
  },
  AltRight: {
    x: 12.5,
    y: 4,
    w: 1,
    h: 1,
    labels: [{ text: "Alt" }],
    zones: ["pinky", "right", "bottom"],
  },
  MetaRight: {
    x: 11,
    y: 4,
    w: 1.5,
    h: 1,
    labels: [{ text: "◆" }],
    zones: ["thumb", "right", "bottom"],
  },
};
