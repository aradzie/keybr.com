export type SchedulerOptions = {
  readonly delayer: (callback: () => void) => void;
  readonly signal: AbortSignal | null;
};

/**
 * Executes a long-running task in smaller chunks interleaved
 * with the browser event loop to avoid freezing of the UI.
 */
export const schedule = (
  work: AsyncIterable<any>,
  { delayer = defaultDelayer, signal = null }: Partial<SchedulerOptions> = {},
): Promise<void> => {
  const it = work[Symbol.asyncIterator]();

  return new Promise((resolve, reject) => {
    const next = ({ done }: IteratorResult<any>) => {
      if (signal?.aborted || done) {
        resolve();
      } else {
        delayer(step);
      }
    };

    const step = () => {
      it.next().then(next, reject);
    };

    delayer(step);
  });
};

export const defaultDelayer = (callback: () => void): void => {
  setTimeout(callback, 0); // Give the browser event loop a chance to run.
};

/**
 * Gives the browser event loop a chance to run.
 */
export const yieldToBrowser = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
};
