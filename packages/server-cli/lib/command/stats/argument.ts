import { InvalidArgumentError } from "commander";
import { parseISO, parseJSON } from "date-fns";
import { UserIdRange, type UserIdRangeItem } from "./userid-range.ts";

export function parseUserIdRange(value: string): UserIdRange {
  const items: UserIdRangeItem[] = [];
  for (const item of value.split(/,/)) {
    const parts = item.split(/-/, 2);
    if (parts.length === 1) {
      const n = parseUserId(parts[0]);
      items.push({ from: n, to: n });
    } else {
      const from = parseUserId(parts[0]);
      const to = parseUserId(parts[1]);
      if (from > to) {
        throw new InvalidArgumentError(`Invalid user id range.`);
      }
      items.push({ from, to });
    }
  }
  return new UserIdRange(items);
}

function parseUserId(s: string): number {
  const n = Number.parseInt(s, 10);
  if (!Number.isInteger(n) || n <= 0 || n >= 0xffffffff) {
    throw new InvalidArgumentError(`Invalid user id.`);
  }
  return n;
}

export function parseTimestamp(value: string): Date {
  let date;
  date = parseJSON(value);
  if (Number.isFinite(date.getTime())) {
    return date;
  }
  date = parseISO(value);
  if (Number.isFinite(date.getTime())) {
    return date;
  }
  throw new InvalidArgumentError(`Invalid timestamp.`);
}
