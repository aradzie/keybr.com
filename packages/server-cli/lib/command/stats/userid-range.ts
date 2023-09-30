export type UserIdRangeItem = {
  readonly from: number;
  readonly to: number;
};

export class UserIdRange implements Iterable<number> {
  readonly items: readonly UserIdRangeItem[];

  constructor(unsorted: readonly UserIdRangeItem[]) {
    const items: UserIdRangeItem[] = [];
    let last: UserIdRangeItem | null = null;
    for (const curr of [
      ...unsorted,
      {
        from: 0xffffffff,
        to: 0xffffffff,
      },
    ].sort(compare)) {
      if (last == null) {
        last = curr;
      } else {
        if (last.to + 1 < curr.from) {
          items.push(last);
          last = curr;
        } else {
          last = { from: last.from, to: Math.max(last.to, curr.to) };
        }
      }
    }
    this.items = items;
  }

  *[Symbol.iterator](): IterableIterator<number> {
    for (const { from, to } of this.items) {
      for (let n = from; n <= to; n++) {
        yield n;
      }
    }
  }

  toString(): string {
    return this.items
      .map(({ from, to }) => (from < to ? `${from}-${to}` : `${from}`))
      .join(",");
  }
}

function compare(a: UserIdRangeItem, b: UserIdRangeItem): number {
  if (a.from < b.from) {
    return -1;
  }
  if (a.from > b.from) {
    return +1;
  }
  if (a.to < b.to) {
    return -1;
  }
  if (a.to > b.to) {
    return +1;
  }
  return 0;
}
