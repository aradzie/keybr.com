export enum Level {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export function getLevel(): Level {
  switch (process.env.LOG_LEVEL) {
    case "debug":
      return Level.DEBUG;
    case "info":
      return Level.INFO;
    case "warn":
      return Level.WARN;
    case "error":
      return Level.ERROR;
  }
  switch (process.env.NODE_ENV) {
    case "production":
      return Level.INFO;
    case "development":
      return Level.DEBUG;
  }
  return Level.INFO;
}
