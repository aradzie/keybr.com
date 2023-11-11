import { useEffect, useRef } from "react";

export const useTimeout0 = (callback: () => void, time: number): void => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    const id = window.setTimeout(() => {
      callbackRef.current();
    }, time);
    return () => {
      window.clearTimeout(id);
    };
  }, [time]);
};

export type TimeoutScheduler = {
  get pending(): boolean;
  cancel(): void;
  schedule(callback: () => void, timeout: number): void;
};

export const useTimeout = (): TimeoutScheduler => {
  const ref = useRef(
    new (class implements TimeoutScheduler {
      private _id: number = 0;

      get pending(): boolean {
        return this._id > 0;
      }

      cancel(): void {
        if (this._id > 0) {
          window.clearTimeout(this._id);
          this._id = 0;
        }
      }

      schedule(callback: () => void, timeout: number): void {
        if (this._id > 0) {
          window.clearTimeout(this._id);
        }
        this._id = window.setTimeout(() => {
          this._id = 0;
          callback();
        }, timeout);
      }
    })(),
  );
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref.current.cancel();
    };
  }, []);
  return ref.current;
};
