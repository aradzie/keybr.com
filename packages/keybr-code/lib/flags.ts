export type Flags = {
  has(flag: string): boolean;
};

export function flagSet(flags: readonly string[] | ReadonlySet<string>): Flags {
  const set = new Set(flags);
  return {
    has(flag) {
      return set.has(flag) || set.has("*");
    },
  };
}
