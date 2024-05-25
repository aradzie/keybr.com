import { useIntlDurations, useIntlNumbers } from "@keybr/intl";
import {
  type TextStats as TextStatsType,
  type WordCount as WordCountType,
} from "@keybr/unicode";
import { Name, NameValue, Para, Value } from "@keybr/widget";
import { type CSSProperties, type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as styles from "./TextStats.module.less";

export function TextStats({
  textStats,
}: {
  readonly textStats: TextStatsType;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const { humanizeDuration } = useIntlDurations();

  const wordCount = textStats.wordCount.slice(0, 15);
  if (wordCount.length === 0) {
    return (
      <>
        <Para>
          <FormattedMessage
            id="wordCount.emptyTextMessage"
            defaultMessage="Please provide some text in order to calculate the associated statistics."
          />
        </Para>
      </>
    );
  } else {
    const avgTypingWpm = 40;
    const avgReadingWpm = 300;
    const {
      numCharacters,
      numWhitespace,
      numWords,
      numUniqueWords,
      avgWordLength,
    } = textStats;
    const timeToType =
      ((numCharacters + numWhitespace) / (avgTypingWpm * 5)) * 60;
    const timeToRead =
      ((numCharacters + numWhitespace) / (avgReadingWpm * 5)) * 60;

    return (
      <>
        <Para>
          <NameValue
            name={formatMessage({
              id: "textStats.numCharsIncludingWhitespace",
              defaultMessage: "Characters including whitespace",
            })}
            value={formatNumber(numCharacters + numWhitespace)}
          />
        </Para>
        <Para>
          <NameValue
            name={formatMessage({
              id: "textStats.numCharsExcludingWhitespace",
              defaultMessage: "Characters excluding whitespace",
            })}
            value={formatNumber(numCharacters)}
          />
        </Para>
        <Para>
          <NameValue
            name={formatMessage({
              id: "textStats.numAllWords",
              defaultMessage: "All words",
            })}
            value={formatNumber(numWords)}
          />
        </Para>
        <Para>
          <NameValue
            name={formatMessage({
              id: "textStats.numUniqueWords",
              defaultMessage: "Unique words",
            })}
            value={formatNumber(numUniqueWords)}
          />
        </Para>
        <Para>
          <NameValue
            name={formatMessage({
              id: "textStats.averageWordLength",
              defaultMessage: "Average word length",
            })}
            value={formatNumber(avgWordLength, 2)}
          />
        </Para>
        <Para>
          <Name
            name={formatMessage(
              {
                id: "textStats.mostCommonWords",
                defaultMessage: "Top {count} most common words",
              },
              { count: formatNumber(wordCount.length) },
            )}
          />
        </Para>
        <WordCount wordCount={wordCount} />
        <Para>
          <Name>
            <FormattedMessage
              id="textStats.timeToType"
              defaultMessage="At the average typing speed of {speed} WPM, it would take {time} to type this text."
              values={{
                speed: formatNumber(avgTypingWpm),
                time: <Value value={humanizeDuration(timeToType)} />,
              }}
            />
          </Name>
        </Para>
        <Para>
          <Name>
            <FormattedMessage
              id="textStats.timeToRead"
              defaultMessage="At the average reading speed of {speed} WPM, it would take {time} to read this text."
              values={{
                speed: formatNumber(avgReadingWpm),
                time: <Value value={humanizeDuration(timeToRead)} />,
              }}
            />
          </Name>
        </Para>
      </>
    );
  }
}

function WordCount({
  wordCount,
}: {
  readonly wordCount: readonly WordCountType[];
}) {
  const { formatNumber } = useIntlNumbers();
  const style = (count: number): CSSProperties => ({
    width: `${Math.round((count / wordCount[0].count) * 30)}rem`,
  });
  return (
    <ul>
      {wordCount.map(({ word, count }) => (
        <li key={word} className={styles.wordCountItem}>
          <div>
            <Value value={`${word}: ${formatNumber(count)}`} />
          </div>
          <div className={styles.wordCountItemBar} style={style(count)} />
        </li>
      ))}
    </ul>
  );
}
