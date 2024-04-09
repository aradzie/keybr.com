import { Letter } from "@keybr/phonetic-model";

export const alphabet = {
  a: new Letter(0x0061, 0.06023259798991231, "A"),
  b: new Letter(0x0062, 0.011354238841331217, "B"),
  c: new Letter(0x0063, 0.025427832785737167, "C"),
  d: new Letter(0x0064, 0.040241985352733885, "D"),
  e: new Letter(0x0065, 0.18029547842024093, "E"),
  f: new Letter(0x0066, 0.008088032602460085, "F"),
  g: new Letter(0x0067, 0.020319915364728845, "G"),
  h: new Letter(0x0068, 0.02533991938788434, "H"),
  i: new Letter(0x0069, 0.07758878880668738, "I"),
  j: new Letter(0x006a, 0.0005230102143447844, "J"),
  k: new Letter(0x006b, 0.010974274155696118, "K"),
  l: new Letter(0x006c, 0.06189103208839022, "L"),
  m: new Letter(0x006d, 0.019832666532561483, "M"),
  n: new Letter(0x006e, 0.08489752128919782, "N"),
  o: new Letter(0x006f, 0.04908398709610126, "O"),
  p: new Letter(0x0070, 0.014446108342087422, "P"),
  q: new Letter(0x0071, 0.000615393784969789, "Q"),
  r: new Letter(0x0072, 0.06786169285442882, "R"),
  s: new Letter(0x0073, 0.06112216237157566, "S"),
  t: new Letter(0x0074, 0.07700468623112283, "T"),
  u: new Letter(0x0075, 0.049395409132562976, "U"),
  v: new Letter(0x0076, 0.008710876675383504, "V"),
  w: new Letter(0x0077, 0.00822064772803469, "W"),
  x: new Letter(0x0078, 0.0006720159734173726, "X"),
  y: new Letter(0x0079, 0.033749804429941216, "Y"),
  z: new Letter(0x007a, 0.0021099215484678482, "Z"),
} as const;

export const letters: readonly Letter[] = [...Object.values(alphabet)];
