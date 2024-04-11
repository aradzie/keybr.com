import { type GeometryDict } from "../types.ts";

export const EXTRA: GeometryDict = {
  Insert: {
    x: 15.5,
    y: 0,
    labels: [{ text: "Insert", pos: [5, 5], align: ["s", "t"] }],
  },
  Home: {
    x: 16.5,
    y: 0,
    labels: [{ text: "Home", pos: [5, 5], align: ["s", "t"] }],
  },
  PageUp: {
    x: 17.5,
    y: 0,
    labels: [
      { text: "Page", pos: [5, 5], align: ["s", "t"] },
      { text: "Up", pos: [5, 18], align: ["s", "t"] },
    ],
  },
  Delete: {
    x: 15.5,
    y: 1,
    labels: [{ text: "Delete", pos: [5, 5], align: ["s", "t"] }],
  },
  End: {
    x: 16.5,
    y: 1,
    labels: [{ text: "End", pos: [5, 5], align: ["s", "t"] }],
  },
  PageDown: {
    x: 17.5,
    y: 1,
    labels: [
      { text: "Page", pos: [5, 5], align: ["s", "t"] },
      { text: "Down", pos: [5, 18], align: ["s", "t"] },
    ],
  },
  ArrowUp: {
    x: 16.5,
    y: 3,
    labels: [{ text: "\u2191", pos: [20, 20], align: ["m", "m"] }],
  },
  ArrowLeft: {
    x: 15.5,
    y: 4,
    labels: [{ text: "\u2190", pos: [20, 20], align: ["m", "m"] }],
  },
  ArrowDown: {
    x: 16.5,
    y: 4,
    labels: [{ text: "\u2193", pos: [20, 20], align: ["m", "m"] }],
  },
  ArrowRight: {
    x: 17.5,
    y: 4,
    labels: [{ text: "\u2192", pos: [20, 20], align: ["m", "m"] }],
  },
  NumLock: {
    x: 19,
    y: 0,
    labels: [
      { text: "Num", pos: [5, 5], align: ["s", "t"] },
      { text: "Lock", pos: [5, 18], align: ["s", "t"] },
    ],
  },
  NumpadDivide: {
    x: 20,
    y: 0,
    labels: [{ text: "\u2044" }],
  },
  NumpadMultiply: {
    x: 21,
    y: 0,
    labels: [{ text: "\u00D7" }],
  },
  NumpadSubtract: {
    x: 22,
    y: 0,
    labels: [{ text: "\u2212" }],
  },
  Numpad7: {
    x: 19,
    y: 1,
    labels: [
      { text: "7", pos: [5, 5], align: ["s", "t"] },
      { text: "Home", pos: [35, 35], align: ["e", "b"] },
    ],
  },
  Numpad8: {
    x: 20,
    y: 1,
    labels: [
      { text: "8", pos: [5, 5], align: ["s", "t"] },
      { text: "\u2191", pos: [35, 35], align: ["e", "b"] },
    ],
  },
  Numpad9: {
    x: 21,
    y: 1,
    labels: [
      { text: "9", pos: [5, 5], align: ["s", "t"] },
      { text: "Pg Up", pos: [35, 35], align: ["e", "b"] },
    ],
  },
  NumpadAdd: {
    x: 22,
    y: 1,
    w: 1,
    h: 2,
    labels: [{ text: "+" }],
  },
  Numpad4: {
    x: 19,
    y: 2,
    labels: [
      { text: "4", pos: [5, 5], align: ["s", "t"] },
      { text: "\u2190", pos: [35, 35], align: ["e", "b"] },
    ],
  },
  Numpad5: {
    x: 20,
    y: 2,
    labels: [{ text: "5", pos: [5, 5], align: ["s", "t"] }],
  },
  Numpad6: {
    x: 21,
    y: 2,
    labels: [
      { text: "6", pos: [5, 5], align: ["s", "t"] },
      { text: "\u2192", pos: [35, 35], align: ["e", "b"] },
    ],
  },
  Numpad1: {
    x: 19,
    y: 3,
    labels: [
      { text: "1", pos: [5, 5], align: ["s", "t"] },
      { text: "End", pos: [35, 35], align: ["e", "b"] },
    ],
  },
  Numpad2: {
    x: 20,
    y: 3,
    labels: [
      { text: "2", pos: [5, 5], align: ["s", "t"] },
      { text: "\u2193", pos: [35, 35], align: ["e", "b"] },
    ],
  },
  Numpad3: {
    x: 21,
    y: 3,
    labels: [
      { text: "3", pos: [5, 5], align: ["s", "t"] },
      { text: "Pg Dn", pos: [35, 35], align: ["e", "b"] },
    ],
  },
  NumpadEnter: {
    x: 22,
    y: 3,
    w: 1,
    h: 2,
    labels: [{ text: "Enter", pos: [5, 5], align: ["s", "t"] }],
  },
  Numpad0: {
    x: 19,
    y: 4,
    w: 2,
    h: 1,
    labels: [
      { text: "0", pos: [5, 5], align: ["s", "t"] },
      { text: "Ins", pos: [75, 35], align: ["e", "b"] },
    ],
  },
  NumpadDecimal: {
    x: 21,
    y: 4,
    labels: [
      { text: ".", pos: [5, 5], align: ["s", "t"] },
      { text: "Del", pos: [35, 35], align: ["e", "b"] },
    ],
  },
};
