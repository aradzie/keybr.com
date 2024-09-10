import { SpeedUnit } from "@keybr/result";
import { InvalidArgumentError } from "commander";
import { parseISO, parseJSON } from "date-fns";
import { UserIdRange, type UserIdRangeItem } from "./userid-range.ts";

export function parseUserIdRange(arg: string): UserIdRange {
  const items: UserIdRangeItem[] = [];
  for (const item of arg.split(/,/)) {
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

function parseUserId(arg: string): number {
  const n = Number.parseInt(arg, 10);
  if (!Number.isInteger(n) || n <= 0 || n >= 0xffffffff) {
    throw new InvalidArgumentError(`Invalid user id.`);
  }
  return n;
}

export function parseTimestamp(arg: string): Date {
  let date;
  if (Number.isFinite((date = parseJSON(arg)).getTime())) {
    return date;
  }
  if (Number.isFinite((date = parseISO(arg)).getTime())) {
    return date;
  }
  throw new InvalidArgumentError(`Invalid timestamp.`);
}

export function parseSpeed(arg: string): number {
  const m = /^(?<value>[0-9]+)(?<unit>wpm|cpm)?$/.exec(arg);
  if (m) {
    const { value, unit } = m.groups!;
    const { factor } = (
      { wpm: SpeedUnit.WPM, cpm: SpeedUnit.CPM } as Record<string, SpeedUnit>
    )[unit || "wpm"];
    return Number.parseInt(value, 10) / factor;
  }
  throw new InvalidArgumentError(`Invalid speed.`);
}
