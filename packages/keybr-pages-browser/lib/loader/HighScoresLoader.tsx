import { catchError } from "@keybr/debug";
import { Layout } from "@keybr/keyboard";
import { type Entry } from "@keybr/page-highscores";
import { type AnyUser } from "@keybr/pages-shared";
import { expectType, request } from "@keybr/request";
import { type ReactNode, useEffect, useState } from "react";

export function HighScoresLoader({
  children,
}: {
  readonly children: (entries: readonly Entry[]) => ReactNode;
}) {
  return children(useHighScoresLoader());
}

export function useHighScoresLoader(): readonly Entry[] {
  const [entries, setEntries] = useState<readonly Entry[]>([]);

  useEffect(() => {
    let didCancel = false;

    loadHighScores()
      .then((entries) => {
        if (!didCancel) {
          setEntries(entries);
        }
      })
      .catch(catchError);

    return () => {
      didCancel = true;
    };
  }, []);

  return entries;
}

async function loadHighScores(): Promise<readonly Entry[]> {
  const response = await request
    .use(expectType("application/json"))
    .GET("/_/high-scores")
    .send();
  const body = await response.json<
    {
      readonly user: AnyUser | null;
      readonly layout: string;
      readonly speed: number;
      readonly score: number;
    }[]
  >();
  return body.map(({ user, layout, speed, score }) => ({
    user: user ?? { id: null, name: "Deleted User", imageUrl: null },
    layout: Layout.ALL.get(layout),
    speed,
    score,
  }));
}
