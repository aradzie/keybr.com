import { useEffect, useRef } from "react";

export const useInterval0 = (callback: () => void, time: number): void => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    const id = setInterval(() => {
      callbackRef.current();
    }, time);
    return () => {
      clearInterval(id);
    };
  }, [time]);
};

export type IntervalScheduler = {
  get pending(): boolean;
  cancel(): void;
  schedule(callback: () => void, timeout: number): void;
};

export const useInterval = (): IntervalScheduler => {
  const ref = useRef<IntervalScheduler>(null!);
  if (ref.current == null) {
    ref.current = new (class implements IntervalScheduler {
      #id: any = null;

      get pending(): boolean {
        return this.#id != null;
      }

      cancel(): void {
        if (this.#id != null) {
          clearInterval(this.#id);
          this.#id = null;
        }
      }

      schedule(callback: () => void, timeout: number): void {
        if (this.#id != null) {
          clearInterval(this.#id);
        }
        this.#id = setInterval(() => {
          callback();
        }, timeout);
      }
    })();
  }
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref.current.cancel();
    };
  }, []);
  return ref.current;
};
