/**
 * Executes a long-running task in smaller chunks interleaved
 * with the browser event loop to avoid freeing of the UI.
 */
export const schedule = (
  work: AsyncIterable<any>,
  delayer = defaultDelayer,
): Promise<void> => {
  const it = work[Symbol.asyncIterator]();

  return new Promise((resolve, reject) => {
    const step = () => {
      it.next().then(
        ({ done }) => {
          if (done) {
            resolve();
          } else {
            delayer(step);
          }
        },
        (err) => {
          reject(err);
        },
      );
    };

    delayer(step);
  });
};

export const defaultDelayer = (callback: () => void): void => {
  setTimeout(callback, 0);
};
