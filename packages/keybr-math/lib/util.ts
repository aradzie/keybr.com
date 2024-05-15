import { makeFilter } from "./filter.ts";

export const hasData = ({ length }: { readonly length: number }): boolean => {
  return length >= 5;
};

export const smooth = (smoothness: number) => {
  const filter = makeFilter(1 / Math.pow(10, smoothness * 3));
  return (value: number): number => filter.add(value);
};

export const resample = (data: number[], newLength: number): number[] => {
  const { length } = data;
  const r = length / newLength;
  const result = new Array<number>(newLength);
  for (let i = 0; i < newLength; i++) {
    result[i] = data[Math.floor(i * r)]; // Nearest neighbour.
  }
  return result;
};
