import { User } from "@keybr/database";
import { type HighScoresRow } from "@keybr/highscores";
import { type AnyUser } from "@keybr/pages-shared";

export type Entry = {
  readonly user: AnyUser | null;
  readonly layout: string;
  readonly speed: number;
  readonly score: number;
};

export async function mapEntries(
  rows: readonly HighScoresRow[],
): Promise<Entry[]> {
  const users = await User.loadAll(rows.map(({ user }) => user));
  return rows.map(({ user, layout, speed, score }) => ({
    user: mapUser(users.get(user) ?? null),
    layout: layout.id,
    speed,
    score,
  }));
}

function mapUser(user: User | null): AnyUser | null {
  if (user != null) {
    return User.toPublicUser(user, 0);
  } else {
    return null;
  }
}
