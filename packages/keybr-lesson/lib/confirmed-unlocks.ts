import { type CodePoint } from "@keybr/unicode";

const storageKey = "lesson.guided.confirmedUnlocks";

// Local-only, like @keybr/settings's Preferences -- deliberately not a
// Settings prop, since writing one reconstructs GuidedLesson itself.
export class ConfirmedUnlocks {
  static load(scope: string): ReadonlySet<CodePoint> {
    return new Set(readAll()[scope] ?? []);
  }

  static confirm(scope: string, codePoint: CodePoint): void {
    const all = readAll();
    const scoped = new Set(all[scope] ?? []);
    if (!scoped.has(codePoint)) {
      scoped.add(codePoint);
      writeAll({ ...all, [scope]: [...scoped] });
    }
  }
}

function readAll(): Record<string, readonly CodePoint[]> {
  if (typeof window !== "object") {
    return {};
  }
  const item = window.localStorage.getItem(storageKey);
  if (item == null) {
    return {};
  }
  try {
    const parsed: unknown = JSON.parse(item);
    return parsed != null && typeof parsed === "object"
      ? (parsed as Record<string, readonly CodePoint[]>)
      : {};
  } catch {
    window.localStorage.removeItem(storageKey);
    return {};
  }
}

function writeAll(all: Record<string, readonly CodePoint[]>): void {
  if (typeof window === "object") {
    window.localStorage.setItem(storageKey, JSON.stringify(all));
  }
}
