import { Article, Figure } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { HighScoresTable } from "./HighScoresTable.tsx";
import { type HighScoresEntry } from "./model.ts";

export function HighScoresApp({
  entries,
}: {
  readonly entries: readonly HighScoresEntry[];
}): ReactNode {
  return (
    <Article>
      <FormattedMessage
        id="page.highScores.content"
        defaultMessage={
          "<h1>High Scores</h1>" +
          "<p>The table of the fastest typists for the last few days, arranged by their scores from best to worst. Typing score is measured from typing speed, text length, the number of different characters in the text, and the number of errors. The formula is designed in such a way to reward for a faster speed, longer text and a larger alphabet, but to punish for the number of errors.</p>"
        }
      />

      <Figure>
        <HighScoresTable entries={entries} />
      </Figure>
    </Article>
  );
}
