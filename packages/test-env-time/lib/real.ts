export const global = globalThis as {
  Date: DateConstructor;
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
  setInterval: typeof setInterval;
  clearInterval: typeof clearInterval;
};

export const real = {
  Date,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
};

export function reset(): void {
  global.Date = real.Date;
  global.setTimeout = real.setTimeout;
  global.clearTimeout = real.clearTimeout;
  global.setInterval = real.setInterval;
  global.clearInterval = real.clearInterval;
}
