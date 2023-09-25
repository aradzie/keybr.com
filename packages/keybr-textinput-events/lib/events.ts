export function eventTimeStamp({ timeStamp }: { timeStamp: number }): number {
  // Mobile Safari reports zero time stamps.
  return Math.round(timeStamp || performance.now());
}
