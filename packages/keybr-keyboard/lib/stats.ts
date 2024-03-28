import { type CodePoint } from "@keybr/unicode";
import { type Keyboard } from "./keyboard.ts";
import { type KeyShape } from "./keyshape.ts";
import { type ZoneId } from "./types.ts";

export type Letter = {
  readonly codePoint: CodePoint;
  readonly f: number;
};

export type Bigram = {
  readonly codePoint0: CodePoint;
  readonly codePoint1: CodePoint;
  readonly f: number;
};

export type KeyboardStats = {
  readonly homeRow: number;
  readonly topRow: number;
  readonly bottomRow: number;
  readonly handSwitches: number;
  readonly fingerSwitches: number;
};

export function computeStats(
  keyboard: Keyboard,
  letters: readonly Letter[],
  bigrams: readonly Bigram[],
): KeyboardStats {
  return {
    homeRow: keysInZone("home"),
    topRow: keysInZone("top"),
    bottomRow: keysInZone("bottom"),
    handSwitches: handSwitches(),
    fingerSwitches: fingerSwitches(),
  };

  function keysInZone(zone: ZoneId): number {
    let a = 0;
    let b = 0;
    for (const { codePoint, f } of letters) {
      const key = getShape(codePoint);
      if (key != null) {
        if (key.isZone(zone)) {
          a += f;
        } else {
          b += f;
        }
      }
    }
    return a / (a + b);
  }

  function handSwitches(): number {
    let a = 0;
    let b = 0;
    for (const { codePoint0, codePoint1, f } of bigrams) {
      const shape0 = getShape(codePoint0);
      const shape1 = getShape(codePoint1);
      if (
        shape0 != null &&
        shape1 != null &&
        shape0.hand != null &&
        shape1.hand != null
      ) {
        if (shape0.hand !== shape1.hand) {
          a += f;
        } else {
          b += f;
        }
      }
    }
    return a / (a + b);
  }

  function fingerSwitches(): number {
    let a = 0;
    let b = 0;
    for (const { codePoint0, codePoint1, f } of bigrams) {
      const shape0 = getShape(codePoint0);
      const shape1 = getShape(codePoint1);
      if (
        shape0 != null &&
        shape1 != null &&
        shape0.finger != null &&
        shape1.finger != null
      ) {
        if (shape0.finger !== shape1.finger) {
          a += f;
        } else {
          b += f;
        }
      }
    }
    return a / (a + b);
  }

  function getShape(codePoint: CodePoint): KeyShape | null {
    const combo = keyboard.getCombo(codePoint);
    return combo == null ? null : keyboard.getShape(combo.id);
  }
}
