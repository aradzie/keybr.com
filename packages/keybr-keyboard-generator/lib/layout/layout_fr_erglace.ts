import { uniq } from "lodash";
import { type LayoutConfig } from "../layout.ts";

export const LAYOUT_FR_ERGLACE: LayoutConfig = {
  codePoints: {
    Digit1: ["1", "!", "\u2081", "\u00b9", "§"],
    Digit2: ["2", "@", "\u2082", "\u00b2", "¶"],
    Digit3: ["3", "#", "\u2083", "\u00b3", "°"],
    Digit4: ["4", "$", "\u2084", "\u2074", "£"],
    Digit5: ["5", "%", "\u2085", "\u2075", "€"],
    Digit6: ["6", "^", "\u2086", "\u2076", "¥"],
    Digit7: ["7", "&", "\u2087", "\u2077", "¤"],
    Digit8: ["8", "*", "\u2088", "\u2078", "„"],
    Digit9: ["9", "(", "\u2089", "\u2079", "“"],
    Digit0: ["0", ")", "\u2080", "\u2070", "”"],
    KeyQ: ["y", "Y", "@", ""],
    KeyW: ["*^", "*^", "<", "\u2264"],
    KeyE: ["o", "O", ">", "\u2265", "ô"],
    KeyR: [
      "f",
      "F",
      "$",
      // "*\u00a4",
      "è",
    ],
    KeyT: ["k", "K", "%", "\u2030", "ù"],
    KeyY: ["v", "V", "^", "*^", "–"],
    KeyU: ["p", "P", "&"],
    KeyI: ["l", "L", "*", "\u00d7", "ñ"],
    KeyO: ["c", "C", "'", "*\u00b4", "ç"],
    KeyP: ["q", "Q", "`", "*`"],
    KeyA: ["i", "I", "{", "", "î"],
    KeyS: ["a", "A", "(", "\u207d", "æ"],
    KeyD: ["e", "E", ")", "\u207e", "ê"],
    KeyF: ["u", "U", "}", "", "é"],
    KeyG: [",", ";", "=", "\u2260", "û"],
    KeyH: [
      "g",
      "G",
      "\\",
      //"*/"
    ],
    KeyJ: ["t", "T", "+", "\u00b1", "à"],
    KeyK: ["n", "N", "-", "\u2014", "â"],
    KeyL: ["s", "S", "/", "\u00f7", "_"],
    Semicolon: ["r", "R", '"', "*\u00a8", "œ"],
    KeyZ: ["j", "J", "~", "*~"],
    KeyX: [".", ":", "["],
    KeyC: ["-", "?", "]", "", "‑"],
    KeyV: ["h", "H", "_", "\u2013"],
    KeyB: ["z", "Z", "#", "", "ŭ"],
    KeyN: ["b", "B", "|", "\u00a6", "—"],
    KeyM: ["d", "D", "!", "\u00ac", "·"],
    Comma: ["m", "M", ";", "*\u00b8", "µ"],
    Period: ["w", "W", ":", "", "ß"],
    Slash: ["x", "X", "?"],
    Minus: ["/", "_"],
    Equal: ["=", "+"],
    BracketLeft: ["[", "{"],
    BracketRight: ["]", "}"],
    Quote: ["'", '"'],
    Backquote: ["`", "~"],
    Backslash: ["\\", "|"],
    IntlBackslash: ["<", ">"],
    Space: [" ", "\u202f", " ", "\u00a0"],
  },
};
