import assert from "node:assert";

type Global = {
  setTimeout: unknown;
  clearTimeout: unknown;
  setInterval: unknown;
  clearInterval: unknown;
};

const realSetTimeout = (global as Global).setTimeout;
const realClearTimeout = (global as Global).clearTimeout;
const realSetInterval = (global as Global).setInterval;
const realClearInterval = (global as Global).clearInterval;

class Task {
  cancelled = false;

  constructor(
    readonly timeout: Timeout,
    readonly ms: number,
    readonly callback: (...args: unknown[]) => void,
    readonly args: unknown[],
  ) {}

  cancel(): void {
    this.cancelled = true;
  }

  run(): void {
    if (!this.cancelled) {
      this.callback.apply(null, this.args);
    }
  }
}

class Timeout {
  hasRef(): boolean {
    return false;
  }

  ref(): this {
    return this;
  }

  unref(): this {
    return this;
  }

  refresh(): this {
    return this;
  }

  [Symbol.toPrimitive](): number {
    return 0;
  }
}

const tasks = new Map<Timeout, Task>();

function fakeSetTimeout(
  callback: (...args: unknown[]) => void,
  ms: number = 0,
  ...args: unknown[]
): Timeout {
  assert(typeof callback === "function");
  assert(typeof ms === "number");
  assert(ms >= 0);
  const timeout = new Timeout();
  tasks.set(timeout, new Task(timeout, ms, callback, args));
  return timeout;
}

function fakeClearTimeout(timeout: Timeout): void {
  assert(timeout instanceof Timeout);
  const task = tasks.get(timeout);
  if (task != null) {
    tasks.delete(timeout);
    task.cancel();
  }
}

function fakeSetInterval(
  callback: (...args: unknown[]) => void,
  ms: number = 0,
  ...args: unknown[]
): Timeout {
  assert(typeof callback === "function");
  assert(typeof ms === "number");
  assert(ms >= 0);
  const timeout = new Timeout();
  tasks.set(timeout, new Task(timeout, ms, callback, args));
  return timeout;
}

function fakeClearInterval(timeout: Timeout): void {
  assert(timeout instanceof Timeout);
  const task = tasks.get(timeout);
  if (task != null) {
    tasks.delete(timeout);
    task.cancel();
  }
}

export function setFakeTimers(): void {
  (global as Global).setTimeout = fakeSetTimeout;
  (global as Global).clearTimeout = fakeClearTimeout;
  (global as Global).setInterval = fakeSetInterval;
  (global as Global).clearInterval = fakeClearInterval;
}

export function resetFakeTimers(): void {
  (global as Global).setTimeout = realSetTimeout;
  (global as Global).clearTimeout = realClearTimeout;
  (global as Global).setInterval = realSetInterval;
  (global as Global).clearInterval = realClearInterval;
}

export async function runTimers(all: boolean = true): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    // First round of tasks.
    let copy = [...tasks.values()];
    while (copy.length > 0) {
      for (const task of copy) {
        try {
          task.run();
        } catch (err) {
          reject(err);
          return;
        }
        tasks.delete(task.timeout);
      }
      // Next round of tasks.
      copy = [...tasks.values()];
      if (!all) {
        break;
      }
    }
    resolve(copy.length);
  });
}
