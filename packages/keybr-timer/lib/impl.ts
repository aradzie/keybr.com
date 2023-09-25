declare const process: {
  hrtime(): [seconds: number, nanoseconds: number];
};

export function makeNow(): () => number {
  // Node?
  if (
    process != null &&
    typeof process === "object" &&
    typeof process.hrtime === "function"
  ) {
    return () => {
      const [seconds, nanoseconds] = process.hrtime();
      return Math.floor(seconds * 1000 + nanoseconds / 1000000);
    };
  }

  // Fallback.
  return () => Date.now();
}
