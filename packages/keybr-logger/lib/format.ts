import { type Level } from "./level.ts";
import { type Message } from "./types.ts";

export function format(level: Level, time: Date, args: unknown[]): Message {
  let err: Error | null = null;
  let format: string;
  let arg = args.shift();
  if (arg instanceof Error) {
    err = arg;
    arg = args.shift();
  }
  if (typeof arg === "string") {
    format = arg;
  } else {
    throw new TypeError();
  }
  return {
    level,
    time,
    err,
    format,
    args,
  };
}
