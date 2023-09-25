import { toCodePoints } from "@keybr/unicode";

const X = 23;
const Y = 13;

export function scrambleWord(word: string): string {
  const a = [...toCodePoints(word)];
  const { length } = a;
  const s = new Array(length);
  for (let i = 0; i < length; i++) {
    s[(X * i + Y) % length] = a[i];
  }
  return String.fromCodePoint(...s);
}

export function unscrambleWord(word: string): string {
  const a = [...toCodePoints(word)];
  const { length } = a;
  const s = new Array(length);
  for (let i = 0; i < length; i++) {
    s[i] = a[(X * i + Y) % length];
  }
  return String.fromCodePoint(...s);
}
