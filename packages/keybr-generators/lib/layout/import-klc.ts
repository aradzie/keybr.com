/**
 * Converts layout definitions created by Keyboard Layout Creator.
 */

import { readFileSync } from "node:fs";
import {
  type Character,
  type CharacterDict,
  type KeyId,
} from "@keybr/keyboard";
import { pathTo } from "../root.ts";
import { makeDeadCharacter } from "./diacritics.ts";

export function importKlc(filename: string): CharacterDict {
  console.log(`Parsing KLC file ${filename}`);
  const text = readFileSync(pathTo(filename), "utf-8");
  const dict = {};
  parseKlc(text, {
    shiftstate: [],
    altgr: false,
    SC_to_VK: {},
    VK_to_SC: {},
    dict,
  });
  return { ...dict, Space: [0x0020] };
}

type ParserState = {
  shiftstate: number[];
  altgr: boolean;
  SC_to_VK: Record<string, string>;
  VK_to_SC: Record<string, string>;
  dict: {
    [key: KeyId]: (Character | null)[];
  };
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

function parseKlc(text: string, state: ParserState): void {
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

function ATTRIBUTES(state: ParserState, line: string): void {
  if (line === "ALTGR") {
    state.altgr = true;
  }
}

function SHIFTSTATE(state: ParserState, line: string): void {
  state.shiftstate.push(Number(line));
}

function LAYOUT(state: ParserState, line: string): void {
  const [SC, VK, CAP, ...arg] = line.split(/\s+/);
  const keyId = scanCodeToKeyId[SC];
  if (keyId != null) {
    const c = [...arg.map((v) => parseCodePoint(keyId, v))];
    const characters = [null, null, null, null] as (Character | null)[];
    for (let i = 0; i < c.length; i++) {
      const s = state.shiftstate[i];
      const m = modifiers(s);
      if (m !== -1) {
        characters[m] = c[i];
      }
    }
    state.dict[keyId] = characters;
    if (state.SC_to_VK[SC] != null) {
      console.error(`[${keyId}] Duplicate SC [${SC}]`);
    }
    if (state.VK_to_SC[VK] != null) {
      console.error(`[${keyId}] Duplicate VK [${VK}]`);
    }
    state.SC_to_VK[SC] = VK;
    state.VK_to_SC[VK] = SC;
  }
}

function LIGATURE(state: ParserState, line: string): void {
  const [VK, MOD, ...arg] = line.split(/\s+/);
  const SC = state.VK_to_SC[VK];
  const keyId = scanCodeToKeyId[SC];
  if (keyId != null) {
    const ligature = String.fromCodePoint(
      ...arg.map((v) => Number.parseInt(v, 16)),
    );
    const characters = state.dict[keyId];
    const s = state.shiftstate[Number(MOD)];
    const m = modifiers(s);
    if (m !== -1) {
      characters[m] = { ligature };
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

function parseCodePoint(keyId: string, v: string): Character | null {
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
    return makeDeadCharacter(keyId, Number.parseInt(m[1], 16));
  }
  console.error(`[${keyId}] Invalid code point [${v}]`);
  return null;
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
