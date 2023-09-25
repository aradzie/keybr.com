export type Callback = () => void;
export type Cancel = () => void;
export const emptyCancel: Cancel = () => {};

export type Timeout = {
  readonly cancel: Cancel;
};

export type Interval = {
  readonly cancel: Cancel;
};

export function setTimeout(callback: Callback, millis: number): Timeout {
  const id = globalThis.setTimeout(callback, millis);
  return {
    cancel: (): void => {
      globalThis.clearTimeout(id);
    },
  };
}

export function setInterval(callback: Callback, millis: number): Interval {
  const id = globalThis.setInterval(callback, millis);
  return {
    cancel: (): void => {
      globalThis.clearInterval(id);
    },
  };
}
