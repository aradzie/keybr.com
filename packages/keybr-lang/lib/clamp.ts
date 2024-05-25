export function clamp(v: number, min: number, max: number): number {
  return Math.max(Math.min(v, max), min);
}
