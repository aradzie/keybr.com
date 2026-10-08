import { type GeometryDict } from "../types.ts";

export const CORNE: GeometryDict = {
  KeyQ: {
    x: 0,
    y: 0,
    zones: ["pinky", "left", "top"],
  },

  KeyW: {
    x: 1,
    y: 0,
    zones: ["ring", "left", "top"],
  },

  KeyE: {
    x: 2,
    y: 0,
    zones: ["middle", "left", "top"],
  },

  KeyR: {
    x: 3,
    y: 0,
    zones: ["leftIndex", "left", "top"],
  },

  KeyT: {
    x: 4,
    y: 0,
    zones: ["leftIndex", "left", "top"],
  },

  KeyA: {
    x: 0.25,
    y: 1,
    zones: ["pinky", "left", "home"],
  },

  KeyS: {
    x: 1.25,
    y: 1,
    zones: ["ring", "left", "home"],
  },

  KeyD: {
    x: 2.25,
    y: 1,
    zones: ["middle", "left", "home"],
  },

  KeyF: {
    x: 3.25,
    y: 1,
    zones: ["leftIndex", "left", "home"],
    homing: true,
  },

  KeyG: {
    x: 4.25,
    y: 1,
    zones: ["leftIndex", "left", "home"],
  },

  KeyZ: {
    x: 0.5,
    y: 2,
    zones: ["pinky", "left", "bottom"],
  },

  KeyX: {
    x: 1.5,
    y: 2,
    zones: ["ring", "left", "bottom"],
  },

  KeyC: {
    x: 2.5,
    y: 2,
    zones: ["middle", "left", "bottom"],
  },

  KeyV: {
    x: 3.5,
    y: 2,
    zones: ["leftIndex", "left", "bottom"],
  },

  KeyB: {
    x: 4.5,
    y: 2,
    zones: ["leftIndex", "left", "bottom"],
  },

  KeyY: {
    x: 7,
    y: 0,
    zones: ["rightIndex", "right", "top"],
  },

  KeyU: {
    x: 8,
    y: 0,
    zones: ["rightIndex", "right", "top"],
  },

  KeyI: {
    x: 9,
    y: 0,
    zones: ["middle", "right", "top"],
  },

  KeyO: {
    x: 10,
    y: 0,
    zones: ["ring", "right", "top"],
  },

  KeyP: {
    x: 11,
    y: 0,
    zones: ["pinky", "right", "top"],
  },

  KeyH: {
    x: 7.25,
    y: 1,
    zones: ["rightIndex", "right", "home"],
  },

  KeyJ: {
    x: 8.25,
    y: 1,
    zones: ["rightIndex", "right", "home"],
    homing: true,
  },

  KeyK: {
    x: 9.25,
    y: 1,
    zones: ["middle", "right", "home"],
  },

  KeyL: {
    x: 10.25,
    y: 1,
    zones: ["ring", "right", "home"],
  },

  Backspace: {
    x: 11.25,
    y: 1,
    zones: ["pinky", "right", "home"],
  },

  KeyN: {
    x: 7.5,
    y: 2,
    zones: ["rightIndex", "right", "bottom"],
  },

  KeyM: {
    x: 8.5,
    y: 2,
    zones: ["rightIndex", "right", "bottom"],
  },

  Comma: {
    x: 9.5,
    y: 2,
    zones: ["middle", "right", "bottom"],
  },

  Period: {
    x: 10.5,
    y: 2,
    zones: ["ring", "right", "bottom"],
  },

  Semicolon: {
    x: 11.5,
    y: 2,
    labels: [{ text: ":" }, { text: ";" }],
    zones: ["pinky", "right", "bottom"],
  },

  ControlLeft: {
    x: 2.5,
    y: 4,
    labels: [{ text: "Ctrl" }],
    zones: ["thumb", "left", "bottom"],
  },

  ShiftLeft: {
    x: 3.5,
    y: 4,
    labels: [{ text: "Shift" }],
    zones: ["thumb", "left", "bottom"],
  },

  Space: {
    x: 4.5,
    y: 4,
    labels: [{ text: "Space" }],
    zones: ["thumb", "left", "bottom"],
  },

  Enter: {
    x: 7,
    y: 4,
    labels: [{ text: "Enter" }],
    zones: ["thumb", "right", "bottom"],
  },

  Quote: {
    x: 8,
    y: 4,
    zones: ["thumb", "right", "bottom"],
  },

  ShiftRight: {
    x: 9,
    y: 4,
    labels: [{ text: "Shift" }],
    zones: ["thumb", "right", "bottom"],
  },
};
