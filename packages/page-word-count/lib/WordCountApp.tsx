import { textStatsOf } from "@keybr/unicode";
import { Article, TextField } from "@keybr/widget";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { EXAMPLE } from "./example.ts";
import { TextStats } from "./TextStats.tsx";
import * as styles from "./WordCountApp.module.less";

export function WordCountApp(): ReactNode {
  const { locale, formatMessage } = useIntl();
  const initialText = useInitialText();
  const [text, setText] = useState(initialText);
  const textStats = useTextStats(locale, text);
  return (
    <Article>
      <FormattedMessage
        id="page.wordCount.content"
        defaultMessage={
          "<h1>Word Count</h1>" +
          "<p>Count the characters and words in your text. Find out what the most common words are. Measure the time taken to type read these words.</p>"
        }
      />
      <TextField
        type="textarea"
        className={styles.textInput}
        placeholder={formatMessage({
          id: "wordCount.textInput.placeholder",
          defaultMessage: "Paste your text here",
        })}
        value={text}
        onFocus={() => {
          if (text === initialText) {
            setText("");
          }
        }}
        onChange={(value) => {
          setText(value);
        }}
      />
      <TextStats textStats={textStats} />
    </Article>
  );
}

function useInitialText(): string {
  const { formatMessage } = useIntl();
  return useMemo(
    () =>
      formatMessage({
        id: "wordCount.exampleText",
        defaultMessage: "(Example text, click here to clear it.)",
      }) +
      "\n\n" +
      EXAMPLE,
    [formatMessage],
  );
}

function useTextStats(locale: string, text: string) {
  const [textStats, setTextStats] = useState(textStatsOf(locale, text));
  useEffect(() => {
    if (text === "") {
      setTextStats(textStatsOf(locale, text));
    }
    const id = setTimeout(() => {
      setTextStats(textStatsOf(locale, text));
    }, 200);
    return () => {
      clearTimeout(id);
    };
  }, [locale, text]);
  return textStats;
}
