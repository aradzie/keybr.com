/**
 * Parses layout definitions created by Keyboard Layout Creator.
 */

import { type Character, type KeyId, KeyModifier } from "@keybr/keyboard";
import { LayoutBuilder } from "../layoutbuilder.ts";
import { makeDeadCharacter } from "./diacritics.ts";
import { type ParseResult } from "./types.ts";

export function parseKlc(text: string): ParseResult {
  const result: ParseResult = { layout: new LayoutBuilder(), warnings: [] };
  parse(text, {
    result,
    shiftstate: [],
    altgr: false,
    SC_to_VK: {},
    VK_to_SC: {},
  });
  return result;
}

type ParserState = {
  result: ParseResult;
  shiftstate: number[];
  altgr: boolean;
  SC_to_VK: Record<string, string>;
  VK_to_SC: Record<string, string>;
};

const enum Section {
  INIT,
  KBD,
  ATTRIBUTES,
  SHIFTSTATE,
  LAYOUT,
  LIGATURE,
  DEADKEY,
  KEYNAME,
  KEYNAME_EXT,
  KEYNAME_DEAD,
  DESCRIPTIONS,
  LANGUAGENAMES,
  ENDKBD,
}

function parse(text: string, state: ParserState) {
  let section = Section.INIT;
  for (const line0 of text.split("\n")) {
    const line = stripComments(line0).trim();
    if (line) {
      if (/^KBD/.test(line)) {
        section = Section.KBD;
        continue;
      }
      if (
        /^COPYRIGHT\s+/.test(line) ||
        /^COMPANY\s+/.test(line) ||
        /^LOCALEID\s+/.test(line) ||
        /^LOCALENAME\s+/.test(line) ||
        /^VERSION\s+/.test(line)
      ) {
        continue;
      }
      if (/^ATTRIBUTES/.test(line)) {
        section = Section.ATTRIBUTES;
        continue;
      }
      if (/^SHIFTSTATE/.test(line)) {
        section = Section.SHIFTSTATE;
        continue;
      }
      if (/^LAYOUT/.test(line)) {
        section = Section.LAYOUT;
        continue;
      }
      if (/^LIGATURE/.test(line)) {
        section = Section.LIGATURE;
        continue;
      }
      if (/^DEADKEY/.test(line)) {
        section = Section.DEADKEY;
        continue;
      }
      if (/^KEYNAME/.test(line)) {
        section = Section.KEYNAME;
        continue;
      }
      if (/^KEYNAME_EXT/.test(line)) {
        section = Section.KEYNAME_EXT;
        continue;
      }
      if (/^KEYNAME_DEAD/.test(line)) {
        section = Section.KEYNAME_DEAD;
        continue;
      }
      if (/^DESCRIPTIONS/.test(line)) {
        section = Section.DESCRIPTIONS;
        continue;
      }
      if (/^LANGUAGENAMES/.test(line)) {
        section = Section.LANGUAGENAMES;
        continue;
      }
      if (/^ENDKBD/.test(line)) {
        section = Section.ENDKBD;
        continue;
      }
      switch (section) {
        case Section.ATTRIBUTES:
          ATTRIBUTES(state, line);
          break;
        case Section.SHIFTSTATE:
          SHIFTSTATE(state, line);
          break;
        case Section.LAYOUT:
          LAYOUT(state, line);
          break;
        case Section.LIGATURE:
          LIGATURE(state, line);
          break;
      }
    }
  }
}

function ATTRIBUTES(state: ParserState, line: string) {
  if (line === "ALTGR") {
    state.altgr = true;
  }
}

function SHIFTSTATE(state: ParserState, line: string) {
  state.shiftstate.push(Number(line));
}

function LAYOUT(state: ParserState, line: string) {
  const [SC, VK, CAP, ...arg] = line.split(/\s+/);
  const key = toKeyId[SC];
  if (key != null) {
    const characters = [...arg.map((v) => parseCodePoint(state, key, v))];
    for (let i = 0; i < characters.length; i++) {
      const mod = modifier(state.shiftstate[i]);
      const character = characters[i];
      if (mod != null) {
        state.result.layout.setOne(key, mod, character);
      }
    }
    if (state.SC_to_VK[SC] != null) {
      state.result.warnings.push(`[${key}] Duplicate SC: ${SC}`);
    }
    if (state.VK_to_SC[VK] != null) {
      state.result.warnings.push(`[${key}] Duplicate VK: ${VK}`);
    }
    state.SC_to_VK[SC] = VK;
    state.VK_to_SC[VK] = SC;
  }
}

function LIGATURE(state: ParserState, line: string) {
  const [VK, MOD, ...arg] = line.split(/\s+/);
  const SC = state.VK_to_SC[VK];
  const key = toKeyId[SC];
  if (key != null) {
    const ligature = String.fromCodePoint(
      ...arg.map((v) => Number.parseInt(v, 16)),
    );
    const mod = modifier(state.shiftstate[Number(MOD)]);
    if (mod != null) {
      state.result.layout.setOne(key, mod, { ligature });
    }
  }
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

function parseCodePoint(
  state: ParserState,
  key: string,
  v: string,
): Character | null {
  if (v === "-1" || v === "%%") {
    return null;
  }
  if (v.length === 1) {
    return v.codePointAt(0)!;
  }
  let m;
  if ((m = /^([0-9a-f]{4})$/.exec(v)) != null) {
    return Number.parseInt(m[1], 16);
  }
  if ((m = /^([0-9a-f]{4})@$/.exec(v)) != null) {
    return makeDeadCharacter(state.result, key, Number.parseInt(m[1], 16));
  }
  state.result.warnings.push(`[${key}] Invalid code point: ${v}`);
  return null;
}

function modifier(shiftState: number): KeyModifier | null {
  switch (shiftState) {
    case 0:
      return KeyModifier.None;
    case 1:
      return KeyModifier.Shift;
    case 6:
      return KeyModifier.Alt;
    case 7:
      return KeyModifier.ShiftAlt;
  }
  return null;
}

const toKeyId: Record<string, KeyId> = {
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
