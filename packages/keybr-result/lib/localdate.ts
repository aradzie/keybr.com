import { isNumber, isObject } from "@keybr/lang";

export enum Month {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}

export enum DayOfWeek {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7,
}

/**
 * A tuple of year, month number and day of month number.
 */
export class LocalDate {
  /**
   * Year number, like 2017 etc.
   */
  readonly year: number;
  /**
   * Month number, 1-12.
   */
  readonly month: Month;
  /**
   * Day of month number, 1-31.
   */
  readonly dayOfMonth: number;
  /**
   * Day of week number, 1-7.
   */
  readonly dayOfWeek: DayOfWeek;
  /**
   * Midnight timestamp, in milliseconds.
   */
  readonly timeStamp: number;
  /**
   * String value in format YYYY-MM-DD.
   */
  readonly value: string;

  static now(): LocalDate {
    return new LocalDate(Date.now());
  }

  /**
   * Create a local date with the specified year, month number and day of month number.
   * @param year Year, like 2015 etc.
   * @param month Month number, 1-12.
   * @param day Day of month number, 1-31.
   */
  constructor(year: number, month: number, day: number);
  /**
   * Create a local date from the specified timestamp, in milliseconds.
   * @param timeStamp Timestamp, in milliseconds.
   */
  constructor(timeStamp: number);
  /**
   * Create a local date from the specified date instance.
   * @param date Date instance.
   */
  constructor(date: Date);
  constructor(...args: any[]) {
    const l = args.length;
    let year: number;
    let month: number;
    let day: number;
    let timeStamp: number;
    let date: Date;
    if (
      l === 3 &&
      isNumber((year = args[0])) &&
      isNumber((month = args[1])) &&
      isNumber((day = args[2]))
    ) {
      date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        throw new Error();
      }
    } else if (l === 1 && isNumber((timeStamp = args[0]))) {
      date = new Date(timeStamp);
    } else if (l === 1 && isObject((date = args[0]))) {
      date = new Date(date.getTime());
    } else {
      throw new TypeError();
    }
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.dayOfMonth = date.getDate();
    let dayOfWeek = date.getDay();
    if (dayOfWeek === 0) {
      dayOfWeek = 7;
    }
    this.dayOfWeek = dayOfWeek;
    this.timeStamp = date.getTime();
    this.value = `${this.year}-${pad0(this.month)}-${pad0(this.dayOfMonth)}`;
    return Object.freeze(this);
  }

  plusDays(days: number): LocalDate {
    const date = new Date(this.timeStamp);
    date.setDate(date.getDate() + days);
    return new LocalDate(date);
  }

  minusDays(days: number): LocalDate {
    const date = new Date(this.timeStamp);
    date.setDate(date.getDate() - days);
    return new LocalDate(date);
  }

  toString(): string {
    return this.value;
  }

  valueOf(): number {
    return this.timeStamp;
  }
}

function pad0(v: number): string {
  if (v < 10) {
    return "0" + String(v);
  } else {
    return String(v);
  }
}
