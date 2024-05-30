import {
  type Character,
  type CharacterDict,
  type GeometryDict,
  type KeyId,
  type LabelShape,
  type ZoneId,
} from "./types.ts";

export class KeyShape {
  static readonly fingerZones: readonly ZoneId[] = [
    "pinky",
    "ring",
    "middle",
    "indexLeft",
    "indexRight",
    "thumb",
  ];
  static readonly handZones: readonly ZoneId[] = ["left", "right"];
  static readonly rowZones: readonly ZoneId[] = [
    "digit",
    "top",
    "home",
    "bottom",
  ];

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
  /** Key labels. */
  readonly labels: readonly LabelShape[];
  /** Key shape SVG path. */
  readonly shape: string | null;
  /** The finger to type this key with. */
  readonly zones: readonly ZoneId[];
  /** Whether this is a homing key. */
  readonly homing: boolean;
  /** The code point produced by this key. */
  readonly a: Character | null;
  /** The code point produced by this key. */
  readonly b: Character | null;
  /** The code point produced by this key. */
  readonly c: Character | null;
  /** The code point produced by this key. */
  readonly d: Character | null;
  /** Finger zone, if any. */
  readonly finger: ZoneId | null;
  /** Hand zone, if any. */
  readonly hand: ZoneId | null;
  /** Row zone, if any. */
  readonly row: ZoneId | null;

  constructor(
    id: KeyId,
    geometryConf: GeometryDict["keyId"],
    characterConf: CharacterDict["keyId"] | null,
  ) {
    const { x, y, w, h, labels, shape, zones, homing } = geometryConf;
    const [a, b, c, d] = characterConf ?? [];
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w ?? 1;
    this.h = h ?? 1;
    this.labels = labels ?? [];
    this.shape = shape ?? null;
    this.zones = zones ?? [];
    this.homing = homing ?? false;
    this.a = a ?? null;
    this.b = b ?? null;
    this.c = c ?? null;
    this.d = d ?? null;
    this.finger = selectZone(KeyShape.fingerZones, this.zones);
    this.hand = selectZone(KeyShape.handZones, this.zones);
    this.row = selectZone(KeyShape.rowZones, this.zones);
  }

  inZone(id: ZoneId): boolean {
    return this.zones.includes(id);
  }

  inAnyZone(ids: readonly ZoneId[]): boolean {
    return ids.some((id) => this.zones.includes(id));
  }

  inAllZones(ids: readonly ZoneId[]): boolean {
    return ids.every((id) => this.zones.includes(id));
  }
}

function selectZone(
  zones: readonly ZoneId[],
  subset: readonly ZoneId[],
): ZoneId | null {
  for (const zone of zones) {
    if (subset.includes(zone)) {
      return zone;
    }
  }
  return null;
}
