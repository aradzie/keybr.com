import { ConsoleTransport } from "./console.ts";
import { format } from "./format.ts";
import { getLevel, Level } from "./level.ts";
import { type Message, type Transport } from "./types.ts";

export type LoggerOptions = {
  readonly level?: Level;
  readonly transports?: readonly Transport[];
};

export class Logger {
  static #level: Level = getLevel();
  static #transports: readonly Transport[] = [new ConsoleTransport()];

  private constructor() {}

  static configure({ level, transports }: LoggerOptions): void {
    if (level !== undefined) {
      Logger.#level = level;
    }
    if (transports !== undefined) {
      Logger.#transports = [...transports];
    }
  }

  static enabled(level: Level): boolean {
    return Logger.#level <= level;
  }

  static #report(message: Message): void {
    for (const transport of Logger.#transports) {
      transport.append(message);
    }
  }

  static debug(err: Error, format: string, ...args: unknown[]): void;
  static debug(format: string, ...args: unknown[]): void;
  static debug(...args: unknown[]): void {
    Logger.#log(Level.DEBUG, args);
  }

  static info(err: Error, format: string, ...args: unknown[]): void;
  static info(format: string, ...args: unknown[]): void;
  static info(...args: unknown[]): void {
    Logger.#log(Level.INFO, args);
  }

  static warn(err: Error, format: string, ...args: unknown[]): void;
  static warn(format: string, ...args: unknown[]): void;
  static warn(...args: unknown[]): void {
    Logger.#log(Level.WARN, args);
  }

  static error(err: Error, format: string, ...args: unknown[]): void;
  static error(format: string, ...args: unknown[]): void;
  static error(...args: unknown[]): void {
    Logger.#log(Level.ERROR, args);
  }

  static #log(level: Level, args: unknown[]): void {
    if (Logger.enabled(level)) {
      Logger.#report(format(level, new Date(), args));
    }
  }
}
