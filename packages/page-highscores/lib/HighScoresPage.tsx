import { StandardLayout } from "@keybr/pages-server";
import { Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { HighScoresApp } from "./HighScoresApp.tsx";
import { type HighScoresEntry } from "./model.ts";

export function HighScoresPage({
  entries,
}: {
  readonly entries: readonly HighScoresEntry[];
}): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.highScores.bind(null),
        title: formatMessage({
          id: "page.highScores.title",
          defaultMessage: "High Scores Table",
        }),
        description: formatMessage({
          id: "page.highScores.description",
          defaultMessage: "The table of users ranked by their typing speed.",
        }),
        entrypoint: "page-static",
      }}
    >
      <HighScoresApp entries={entries} />
    </StandardLayout>
  );
}
