declare const performance: {
  now(): number;
};

export function makeNow(): () => number {
  // Browser?
  if (
    performance != null &&
    typeof performance === "object" &&
    typeof performance.now === "function"
  ) {
    return () => Math.floor(performance.now());
  }

  // Fallback.
  return () => Date.now();
}
