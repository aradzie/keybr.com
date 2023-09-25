import { Letter } from "@keybr/phonetic-model";

export const alphabet = {
  a: new Letter(97, 0.06023259798991231),
  b: new Letter(98, 0.011354238841331217),
  c: new Letter(99, 0.025427832785737167),
  d: new Letter(100, 0.040241985352733885),
  e: new Letter(101, 0.18029547842024093),
  f: new Letter(102, 0.008088032602460085),
  g: new Letter(103, 0.020319915364728845),
  h: new Letter(104, 0.02533991938788434),
  i: new Letter(105, 0.07758878880668738),
  j: new Letter(106, 0.0005230102143447844),
  k: new Letter(107, 0.010974274155696118),
  l: new Letter(108, 0.06189103208839022),
  m: new Letter(109, 0.019832666532561483),
  n: new Letter(110, 0.08489752128919782),
  o: new Letter(111, 0.04908398709610126),
  p: new Letter(112, 0.014446108342087422),
  q: new Letter(113, 0.000615393784969789),
  r: new Letter(114, 0.06786169285442882),
  s: new Letter(115, 0.06112216237157566),
  t: new Letter(116, 0.07700468623112283),
  u: new Letter(117, 0.049395409132562976),
  v: new Letter(118, 0.008710876675383504),
  w: new Letter(119, 0.00822064772803469),
  x: new Letter(120, 0.0006720159734173726),
  y: new Letter(121, 0.033749804429941216),
  z: new Letter(122, 0.0021099215484678482),
} as const;

export const letters: readonly Letter[] = [...Object.values(alphabet)];
