import { formatWithOptions, inspect, type InspectOptions } from "node:util";
import chalk from "chalk";
import { Level } from "./level.ts";
import { type Message, type Transport } from "./types.ts";

export class ConsoleTransport implements Transport {
  readonly #inspectOptions: InspectOptions;

  constructor(inspectOptions: InspectOptions = {}) {
    this.#inspectOptions = {
      colors: chalk.level > 0,
      ...inspectOptions,
    };
  }

  append(message: Message): void {
    const { level, time, err, format, args } = message;
    const a = chalk.gray(time.toISOString());
    const b = chalk.cyan(Level[level]);
    const c = formatWithOptions(this.#inspectOptions, format, ...args);
    const log = getLog(message);
    log(`${a} ${b}: ${c}`);
    if (err != null) {
      log(inspect(err, this.#inspectOptions));
    }
  }
}

function getLog(message: Message) {
  switch (message.level) {
    case Level.DEBUG:
      return console.debug;
    case Level.INFO:
      return console.info;
    case Level.WARN:
      return console.warn;
    case Level.ERROR:
      return console.error;
    default:
      return console.log;
  }
}
