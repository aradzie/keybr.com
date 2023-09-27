import {
  hasData,
  type Model,
  polynomialRegression,
  r2,
  Vector,
} from "@keybr/math";
import { type KeySample, timeToSpeed } from "@keybr/result";
import { SPEED_THRESHOLD } from "./confidence.ts";
import { findSession } from "./learningsession.ts";

export class LearningRate {
  static from(samples: readonly KeySample[]): LearningRate | null {
    const recent = samples.slice(-30);
    if (hasData(recent)) {
      return new LearningRate(recent);
    } else {
      return null;
    }
  }

  static example(): LearningRate {
    return new LearningRate(
      new Array(15).fill(0).map((value, index) => {
        const timeStamp =
          /* 2001-01-01T12:00:00Z */ 978350400000 + index * 60000;
        const timeToType = 500 - index * 10;
        return {
          index,
          timeStamp: timeStamp,
          hitCount: 30,
          missCount: 0,
          timeToType: timeToType,
          filteredTimeToType: timeToType,
        } satisfies KeySample;
      }),
    );
  }

  readonly vIndex: Vector;
  readonly vSpeed: Vector;
  readonly mSpeed: Model;

  readonly remainingLessons: number = NaN;
  readonly certainty: number = NaN;

  constructor(readonly samples: readonly KeySample[]) {
    const { length } = samples;
    const vIndex = new Vector();
    const vSpeed = new Vector();
    for (let index = 0; index < length; index++) {
      const sample = samples[index];
      vIndex.add(sample.index + 1);
      vSpeed.add(timeToSpeed(sample.filteredTimeToType));
    }
    let mSpeed: Model;
    const session = findSession(samples);
    if (hasData(session)) {
      const { length } = session;
      const vIndex = new Vector();
      const vSpeed = new Vector();
      for (let index = 0; index < length; index++) {
        const sample = session[index];
        vIndex.add(sample.index + 1);
        vSpeed.add(timeToSpeed(sample.filteredTimeToType));
      }
      mSpeed = polynomialRegression(
        vIndex.values,
        vSpeed.values,
        getPolyDegree(length),
      );
    } else {
      mSpeed = polynomialRegression(
        vIndex.values,
        vSpeed.values,
        getPolyDegree(length),
      );
    }
    this.vIndex = vIndex;
    this.vSpeed = vSpeed;
    this.mSpeed = mSpeed;
    const lastIndex = samples[length - 1].index;
    for (let i = 1; i <= 50; i++) {
      if (mSpeed.eval(lastIndex + i + 1) >= SPEED_THRESHOLD) {
        const certainty = r2(vIndex.values, vSpeed.values, mSpeed);
        if (certainty >= 0.5) {
          this.remainingLessons = i;
          this.certainty = certainty;
        }
        break;
      }
    }
  }
}

function getPolyDegree(length: number): number {
  if (length > 20) {
    return 3; // Fit cubic polynomial.
  }
  if (length > 10) {
    return 2; // Fit quadratic polynomial.
  }
  return 1; // Fit linear polynomial.
}
