import { type Layout } from "@keybr/keyboard";
import { type Histogram, type Stats } from "@keybr/textinput";
import { type TextType } from "./texttype.ts";

export type Filter = {
  readonly minLength: number;
  readonly minTime: number;
  readonly minComplexity: number;
  readonly minSpeed: number;
  readonly maxSpeed: number;
};

export class Result {
  static readonly filter = {
    minLength: 10,
    minTime: 1000,
    minComplexity: 1,
    minSpeed: 1,
    maxSpeed: Infinity,
  } as const satisfies Filter;

  static fromStats(
    layout: Layout,
    textType: TextType,
    timeStamp: number,
    stats: Stats,
  ): Result {
    return new Result(
      layout,
      textType,
      timeStamp,
      stats.length,
      stats.time,
      stats.errors,
      stats.histogram,
    );
  }

  static readonly isValid = (result: Result): boolean => result.validate();

  readonly complexity: number;
  readonly speed: number;
  readonly accuracy: number;
  readonly score: number;

  constructor(
    readonly layout: Layout,
    readonly textType: TextType,
    readonly timeStamp: number,
    readonly length: number,
    readonly time: number,
    readonly errors: number,
    readonly histogram: Histogram,
  ) {
    const { complexity } = histogram;
    let speed = 0;
    let accuracy = 0;
    let score = 0;
    if (length > 0 && time > 0 && complexity > 0) {
      speed = (length / (time / 1000)) * 60;
      accuracy = (length - errors) / length;
      score = ((speed * complexity) / (errors + 1)) * (length / 50);
    }
    this.complexity = complexity;
    this.speed = speed;
    this.accuracy = accuracy;
    this.score = score;
  }

  validate({
    minLength = Result.filter.minLength,
    minTime = Result.filter.minTime,
    minComplexity = Result.filter.minComplexity,
    minSpeed = Result.filter.minSpeed,
    maxSpeed = Result.filter.maxSpeed,
  }: Partial<Filter> = {}): boolean {
    return (
      this.length >= minLength &&
      this.time >= minTime &&
      this.complexity >= minComplexity &&
      this.speed >= minSpeed &&
      this.speed <= maxSpeed &&
      this.histogram.validate()
    );
  }

  toJSON() {
    return {
      layout: this.layout.id,
      textType: this.textType.id,
      timeStamp: new Date(this.timeStamp),
      length: this.length,
      time: this.time,
      errors: this.errors,
      speed: this.speed,
      histogram: [...this.histogram],
    };
  }
}

/**
 * Convert type-to-type in milliseconds to typing speed in characters per minute.
 * @param v Time-to-type in milliseconds.
 * @return Typing speed in characters per minute.
 */
export function timeToSpeed(v: number): number {
  if (!Number.isFinite(v) || v === 0) {
    throw new Error();
  }
  return (60 * 1000) / v;
}

/**
 * Convert typing speed in characters per minute to type-to-type in milliseconds.
 * @param v Typing speed in characters per minute.
 * @return Time-to-type in milliseconds.
 */
export function speedToTime(v: number): number {
  if (!Number.isFinite(v) || v === 0) {
    throw new Error();
  }
  return 1000 / (v / 60);
}
