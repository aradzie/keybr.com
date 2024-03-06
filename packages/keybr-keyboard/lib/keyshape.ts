import { type CodePoint } from "@keybr/unicode";
import {
  type CodePointDict,
  type FingerId,
  type GeometryDict,
  type KeyId,
  type LabelShape,
} from "./types.ts";

export class KeyShape {
  /** Key identifier. */
  readonly id: KeyId;
  /** Key X position. */
  readonly x: number;
  /** Key Y position. */
  readonly y: number;
  /** Key width. */
  readonly w: number;
  /** Key height. */
  readonly h: number;
  /** Rotation X. */
  readonly rx: number;
  /** Rotation Y. */
  readonly ry: number;
  /** Rotation angle. */
  readonly ra: number;
  /** Key labels. */
  readonly labels: readonly LabelShape[];
  /** Key shape SVG path. */
  readonly shape: string | null;
  /** The finger to type this key with. */
  readonly finger: FingerId | null;
  /** Key features, such as homing, special, etc. */
  readonly features: readonly string[];
  /** The code point produced by this key. */
  readonly a: CodePoint;
  /** The code point produced by this key. */
  readonly b: CodePoint;
  /** The code point produced by this key. */
  readonly c: CodePoint;
  /** The code point produced by this key. */
  readonly d: CodePoint;

  constructor(
    id: KeyId,
    geometryConf: GeometryDict["keyId"],
    codePointConf: CodePointDict["keyId"] | null,
  ) {
    const { x, y, w, h, rx, ry, ra, labels, shape, finger, features } =
      geometryConf;
    const [a, b, c, d] = codePointConf ?? [];
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w ?? 1;
    this.h = h ?? 1;
    this.rx = rx ?? 0;
    this.ry = ry ?? 0;
    this.ra = ra ?? 0;
    this.labels = labels ?? [];
    this.shape = shape ?? null;
    this.finger = finger ?? null;
    this.features = features ?? [];
    this.a = a ?? 0;
    this.b = b ?? 0;
    this.c = c ?? 0;
    this.d = d ?? 0;
  }
}
