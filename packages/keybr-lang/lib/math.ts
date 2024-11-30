export const clamp = (v: number, min: number, max: number): number => {
  return Math.max(Math.min(v, max), min);
};

export const round = (v: number, digits: number): number => {
  const b = Math.pow(10, digits);
  return Math.round(v * b) / b;
};
