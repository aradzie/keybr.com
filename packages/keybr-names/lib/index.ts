import { randomSample, XorShift128Plus } from "@keybr/rand";
import adjectives from "./data/adjectives.json";
import animals from "./data/animals.json";
import colors from "./data/colors.json";

export type Options = {
  readonly separator?: string;
  readonly capitalize?: boolean;
  readonly long?: boolean;
  readonly seed?: number;
};

export function generateName({
  separator = " ",
  capitalize = true,
  long = false,
  seed = 0,
}: Options = {}): string {
  let random = Math.random;
  if (seed) {
    random = XorShift128Plus(seed);
  }
  if (long) {
    return fromParts(
      [
        randomSample(adjectives, random),
        randomSample(colors, random),
        randomSample(animals, random),
      ],
      {
        separator,
        capitalize,
      },
    );
  } else {
    return fromParts(
      [
        randomSample([...adjectives, ...colors], random),
        randomSample(animals, random),
      ],
      {
        separator,
        capitalize,
      },
    );
  }
}

function fromParts(
  parts: readonly string[],
  {
    separator,
    capitalize,
  }: {
    separator: string;
    capitalize: boolean;
  },
): string {
  return parts
    .map((v) => {
      if (capitalize) {
        return v.substring(0, 1).toUpperCase() + v.substring(1).toLowerCase();
      } else {
        return v.toLowerCase();
      }
    })
    .join(separator);
}
