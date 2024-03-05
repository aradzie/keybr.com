import { User } from "@keybr/database";
import { type HighScoresRow } from "@keybr/highscores";
import { type Layout } from "@keybr/keyboard";
import { type AnyUser } from "@keybr/pages-shared";

export type HighScoresEntry = {
  readonly user: AnyUser;
  readonly layout: Layout;
  readonly speed: number;
  readonly score: number;
};

export async function mapHighScoresEntries(
  rows: readonly HighScoresRow[],
): Promise<HighScoresEntry[]> {
  const users = await User.loadAll(rows.map(({ user }) => user));
  return rows.map(({ user, layout, speed, score }) => ({
    user: mapUser(users.get(user) ?? null),
    layout,
    speed,
    score,
  }));
}

function mapUser(user: User | null): AnyUser {
  if (user != null) {
    return User.toPublicUser(user, 0);
  } else {
    return { id: null, name: "deleted user", imageUrl: null };
  }
}
