import assert from "node:assert";
import { real } from "./real.ts";

const fake = {
  Date(time: number) {
    function now() {
      return time;
    }

    return new Proxy(real.Date, {
      construct(target: any, args: any[]): object {
        if (args.length === 0) {
          return new real.Date(time); // Magic.
        }
        return Reflect.construct(target, args);
      },
      get(target: any, p: string | symbol): any {
        if (p === "now") {
          return now; // Magic.
        }
        return Reflect.get(target, p);
      },
    });
  },
};

export const date = {
  set(date: number | string | Date): void {
    const time = new real.Date(date).getTime();
    assert(time >= 0);
    global.Date = fake.Date(time);
  },
  reset(): void {
    global.Date = real.Date;
  },
};
