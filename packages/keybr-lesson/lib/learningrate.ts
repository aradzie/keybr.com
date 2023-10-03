import {
  hasData,
  type Polynomial,
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

  /** A vector of indices which are lesson numbers. */
  readonly vIndex: Vector;
  /** A vector of values which are typing speeds. */
  readonly vSpeed: Vector;
  /** A derived model which approximates values. */
  readonly mSpeed: Polynomial;

  readonly certainty: number = NaN;
  readonly learningRate: number = NaN;
  readonly remainingLessons: number = NaN;

  constructor(readonly samples: readonly KeySample[]) {
    const session = findSession(samples);
    if (hasData(session)) {
      // Replace all samples with the latest learning session
      // of lessons without breaks between them.
      samples = session;
    }
    const { length } = samples;
    const vIndex = new Vector();
    const vSpeed = new Vector();
    for (let index = 0; index < length; index++) {
      const sample = samples[index];
      vIndex.add(sample.index + 1);
      vSpeed.add(timeToSpeed(sample.filteredTimeToType));
    }
    const mSpeed = polynomialRegression(
      vIndex,
      vSpeed,
      getPolynomialDegree(length),
    );
    this.vIndex = vIndex;
    this.vSpeed = vSpeed;
    this.mSpeed = mSpeed;
    const certainty = r2(vIndex, vSpeed, mSpeed);
    if (certainty >= 0.5) {
      const lastIndex = samples[length - 1].index + 1;
      this.certainty = certainty;
      this.learningRate = mSpeed.derivative().eval(lastIndex);
      for (let i = 1; i <= 50; i++) {
        if (mSpeed.eval(lastIndex + i) >= SPEED_THRESHOLD) {
          this.remainingLessons = i;
          break;
        }
      }
    }
  }
}

function getPolynomialDegree(length: number): number {
  if (length > 20) {
    return 3; // Fit cubic polynomial.
  }
  if (length > 10) {
    return 2; // Fit quadratic polynomial.
  }
  return 1; // Fit linear polynomial.
}
