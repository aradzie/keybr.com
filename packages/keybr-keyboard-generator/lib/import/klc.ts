/**
 * Converts layout definitions created by Keyboard Layout Creator.
 */

import { readFileSync } from "node:fs";
import { type KeyId } from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import { diacritics } from "../util/diacritics.ts";
import { characterKeys } from "../util/keys.ts";
import { type CodePointList, type KeyMap } from "../util/layout.ts";

export function importKlc(filename: string): KeyMap {
  const content = readFileSync(filename, "utf8");
  const state = { shiftstate: [], altgr: false, keyMap: {} } as ParserState;
  parse(content, state);
  const keyMap = {} as { [key: KeyId]: CodePointList };
  for (const key of characterKeys) {
    const codePoints = state.keyMap[key];
    if (codePoints != null && codePoints.length > 0) {
      keyMap[key] = codePoints;
    }
  }
  return keyMap;
}

type ParserState = {
  shiftstate: number[];
  altgr: boolean;
  keyMap: {
    [key: KeyId]: CodePoint[];
  };
};

const enum Section {
  INIT,
  KBD,
  ATTRIBUTES,
  SHIFTSTATE,
  LAYOUT,
  DEADKEY,
  KEYNAME,
  KEYNAME_EXT,
  KEYNAME_DEAD,
  ENDKBD,
}

function parse(content: string, state: ParserState): void {
  let section = Section.INIT;
  for (const line0 of content.split("\n")) {
    const line = stripComments(line0).trim();
    if (line) {
      switch (section) {
        case Section.INIT:
          section = _INIT(state, line);
          continue;
        case Section.KBD:
          section = _KBD(state, line);
          continue;
        case Section.ATTRIBUTES:
          section = _ATTRIBUTES(state, line);
          break;
        case Section.SHIFTSTATE:
          section = _SHIFTSTATE(state, line);
          break;
        case Section.LAYOUT:
          section = _LAYOUT(state, line);
          break;
        case Section.DEADKEY:
        case Section.KEYNAME:
        case Section.KEYNAME_EXT:
        case Section.KEYNAME_DEAD:
          section = _rest(state, line, section);
          break;
        case Section.ENDKBD:
          throw new Error(`Unexpected line ${line}`);
      }
    }
  }
}

function _INIT(state: ParserState, line: string): Section {
  if (is_KBD(state, line)) {
    return Section.KBD;
  }
  throw new Error(`Unexpected line ${line}`);
}

function _KBD(state: ParserState, line: string): Section {
  if (
    /^COPYRIGHT\s+/.test(line) ||
    /^COMPANY\s+/.test(line) ||
    /^LOCALEID\s+/.test(line) ||
    /^LOCALENAME\s+/.test(line) ||
    /^VERSION\s+/.test(line)
  ) {
    return Section.KBD;
  }
  if (is_ATTRIBUTES(state, line)) {
    return Section.ATTRIBUTES;
  }
  if (is_SHIFTSTATE(state, line)) {
    return Section.SHIFTSTATE;
  }
  throw new Error(`Unexpected line ${line}`);
}

function _ATTRIBUTES(state: ParserState, line: string): Section {
  if (is_SHIFTSTATE(state, line)) {
    return Section.SHIFTSTATE;
  }
  if (line === "ALTGR") {
    state.altgr = true;
  }
  return Section.ATTRIBUTES;
}

function _SHIFTSTATE(state: ParserState, line: string): Section {
  if (is_LAYOUT(state, line)) {
    return Section.LAYOUT;
  }
  state.shiftstate.push(Number(line));
  return Section.SHIFTSTATE;
}

function _LAYOUT(state: ParserState, line: string): Section {
  if (is_DEADKEY(state, line)) {
    return Section.DEADKEY;
  }
  if (is_KEYNAME(state, line)) {
    return Section.KEYNAME;
  }
  if (is_KEYNAME_EXT(state, line)) {
    return Section.KEYNAME_EXT;
  }
  if (is_KEYNAME_DEAD(state, line)) {
    return Section.KEYNAME_DEAD;
  }
  if (is_ENDKBD(state, line)) {
    return Section.ENDKBD;
  }
  parseLayout(state, line);
  return Section.LAYOUT;
}

function _rest(state: ParserState, line: string, section: Section): Section {
  if (is_DEADKEY(state, line)) {
    return Section.DEADKEY;
  }
  if (is_KEYNAME(state, line)) {
    return Section.KEYNAME;
  }
  if (is_KEYNAME_EXT(state, line)) {
    return Section.KEYNAME_EXT;
  }
  if (is_KEYNAME_DEAD(state, line)) {
    return Section.KEYNAME_DEAD;
  }
  if (is_ENDKBD(state, line)) {
    return Section.ENDKBD;
  }
  return section;
}

function is_KBD(state: ParserState, line: string): boolean {
  return /^KBD/.test(line);
}

function is_ATTRIBUTES(state: ParserState, line: string): boolean {
  return /^ATTRIBUTES/.test(line);
}

function is_SHIFTSTATE(state: ParserState, line: string): boolean {
  return /^SHIFTSTATE/.test(line);
}

function is_LAYOUT(state: ParserState, line: string): boolean {
  return /^LAYOUT/.test(line);
}

function is_DEADKEY(state: ParserState, line: string): boolean {
  return /^DEADKEY\s+/.test(line);
}

function is_KEYNAME(state: ParserState, line: string): boolean {
  return /^KEYNAME\s+/.test(line);
}

function is_KEYNAME_EXT(state: ParserState, line: string): boolean {
  return /^KEYNAME_EXT\s+/.test(line);
}

function is_KEYNAME_DEAD(state: ParserState, line: string): boolean {
  return /^KEYNAME_DEAD\s+/.test(line);
}

function is_ENDKBD(state: ParserState, line: string): boolean {
  return /^ENDKBD/.test(line);
}

function stripComments(line: string): string {
  let s = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line.charAt(i);
    switch (s) {
      case false:
        if (ch === '"') {
          s = true;
          continue;
        }
        if (ch === ";") {
          return line.substring(0, i);
        }
        if (ch === "/" && line.charAt(i + 1) === "/") {
          return line.substring(0, i);
        }
        break;
      case true:
        if (ch === '"') {
          s = false;
          continue;
        }
        break;
    }
  }
  return line;
}

function parseLayout(state: ParserState, line: string): void {
  const [SC, VK, CAP, ...arg] = line.split(/\s+/);
  const keyId = scanCodeToKeyId[SC];
  if (keyId != null && characterKeys.includes(keyId)) {
    const c = [...arg.map(parseCodePoint)];
    if (state.shiftstate.length !== c.length) {
      throw new TypeError(`Code point list`);
    }
    const codePoints = [0, 0, 0, 0];
    for (let i = 0; i < state.shiftstate.length; i++) {
      const s = state.shiftstate[i];
      const m = modifiers(s);
      if (m !== -1) {
        codePoints[m] = c[i];
      }
    }
    state.keyMap[keyId] = codePoints;
  }
}

function parseCodePoint(v: string): CodePoint {
  if (v === "-1") {
    return 0;
  }
  let m;
  if ((m = /^([0-9a-f]{4})$/.exec(v)) != null) {
    return Number.parseInt(m[1], 16);
  }
  if ((m = /^([0-9a-f]{4})@$/.exec(v)) != null) {
    return diacritics.get(Number.parseInt(m[1], 16)) ?? 0;
  }
  if (v.length === 1) {
    return v.codePointAt(0)!;
  }
  throw new TypeError(`Unrecognized code point: ${v}`);
}

function modifiers(shiftState: number): number {
  switch (shiftState) {
    case 0: // No modifiers
      return 0;
    case 1: // Shift
      return 1;
    case 6: // AltGr
      return 2;
    case 7: // AltGr+Shift
      return 3;
  }
  return -1;
}

const scanCodeToKeyId: {
  readonly [scanCode: string]: KeyId;
} = {
  "02": "Digit1",
  "03": "Digit2",
  "04": "Digit3",
  "05": "Digit4",
  "06": "Digit5",
  "07": "Digit6",
  "08": "Digit7",
  "09": "Digit8",
  "0a": "Digit9",
  "0b": "Digit0",
  "0c": "Minus",
  "0d": "Equal",
  "10": "KeyQ",
  "11": "KeyW",
  "12": "KeyE",
  "13": "KeyR",
  "14": "KeyT",
  "15": "KeyY",
  "16": "KeyU",
  "17": "KeyI",
  "18": "KeyO",
  "19": "KeyP",
  "1a": "BracketLeft",
  "1b": "BracketRight",
  "1e": "KeyA",
  "1f": "KeyS",
  "20": "KeyD",
  "21": "KeyF",
  "22": "KeyG",
  "23": "KeyH",
  "24": "KeyJ",
  "25": "KeyK",
  "26": "KeyL",
  "27": "Semicolon",
  "28": "Quote",
  "29": "Backquote",
  "2b": "Backslash",
  "2c": "KeyZ",
  "2d": "KeyX",
  "2e": "KeyC",
  "2f": "KeyV",
  "30": "KeyB",
  "31": "KeyN",
  "32": "KeyM",
  "33": "Comma",
  "34": "Period",
  "35": "Slash",
  "39": "Space",
  "56": "IntlBackslash",
};
