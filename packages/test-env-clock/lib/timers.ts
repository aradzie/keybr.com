import assert from "node:assert";
import { real } from "./real.ts";

class Task {
  static id = 0;

  id = (Task.id += 1);
  cancelled = false;

  constructor(
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
    return this.id;
  }
}

const tasks: Task[] = [];

const fake = {
  setTimeout: new Proxy(real.setTimeout, {
    apply(target: any, thisArg: any, args: any[]): any {
      console.assert(args.length >= 2);
      const [callback, ms, ...rest] = args;
      assert(typeof callback === "function");
      assert(typeof ms === "number");
      assert(ms >= 0);
      const task = new Task(ms, callback, rest);
      tasks.push(task);
      return task;
    },
  }),
  clearTimeout: new Proxy(real.clearTimeout, {
    apply(target: any, thisArg: any, args: any[]): any {
      console.assert(args.length === 1);
      const [task] = args;
      assert(task instanceof Task);
      task.cancel();
    },
  }),
  setInterval: new Proxy(real.setInterval, {
    apply(target: any, thisArg: any, args: any[]): any {
      console.assert(args.length >= 2);
      const [callback, ms, ...rest] = args;
      assert(typeof callback === "function");
      assert(typeof ms === "number");
      assert(ms >= 0);
      const task = new Task(ms, callback, rest);
      tasks.push(task);
      return task;
    },
  }),
  clearInterval: new Proxy(real.clearInterval, {
    apply(target: any, thisArg: any, args: any[]): any {
      console.assert(args.length === 1);
      const [task] = args;
      assert(task instanceof Task);
      task.cancel();
    },
  }),
};

export const timers = {
  set(): void {
    global.setTimeout = fake.setTimeout;
    global.clearTimeout = fake.clearTimeout;
    global.setInterval = fake.setInterval;
    global.clearInterval = fake.clearInterval;
  },
  reset(): void {
    global.setTimeout = real.setTimeout;
    global.clearTimeout = real.clearTimeout;
    global.setInterval = real.setInterval;
    global.clearInterval = real.clearInterval;
  },
  get pending(): number {
    return tasks.length;
  },
  clear(): void {
    tasks.length = 0;
  },
  async run(): Promise<void> {
    return new Promise((resolve, reject) => {
      while (tasks.length > 0) {
        const task = tasks.shift() as Task;
        try {
          task.run();
        } catch (err) {
          console.error(err);
          reject(err);
          return;
        }
      }
      resolve();
    });
  },
};
