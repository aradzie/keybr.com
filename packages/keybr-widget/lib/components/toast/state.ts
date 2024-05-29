import { type ReactElement } from "react";
import { type ToastOptions } from "./types.ts";

let nextKey = 0;

export class Toast {
  #key = (nextKey += 1);
  #timeout: any = null;

  constructor(
    readonly message: ReactElement,
    readonly options: ToastOptions,
  ) {}

  get key() {
    return this.#key;
  }

  delayed(cb: any, timeout: number) {
    this.clearDelayed();
    this.#timeout = setTimeout(cb, timeout);
  }

  clearDelayed() {
    if (this.#timeout != null) {
      clearTimeout(this.#timeout);
      this.#timeout = null;
    }
  }
}

export type Listener = (toasts: Toast[]) => void;

export const state = new (class {
  readonly #toasts = new Set<Toast>();
  readonly #listeners = new Set<Listener>();

  get toasts() {
    return [...this.#toasts];
  }

  listen(listener: Listener) {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  add(toast: Toast) {
    this.#toasts.add(toast);
    this.#fire();
    this.#scheduleAutoClose(toast);
  }

  close(toast: Toast) {
    this.#toasts.delete(toast);
    this.#fire();
  }

  retain(toast: Toast, keep: boolean) {
    if (keep) {
      toast.clearDelayed();
    } else {
      this.#scheduleAutoClose(toast);
    }
  }

  #scheduleAutoClose(toast: Toast) {
    if (toast.options.autoClose) {
      toast.delayed(() => {
        this.#toasts.delete(toast);
        this.#fire();
      }, toast.options.autoClose);
    }
  }

  #fire() {
    for (const listener of this.#listeners) {
      listener(this.toasts);
    }
  }
})();
