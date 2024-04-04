import { type TextStats, textStatsOf } from "@keybr/plaintext";
import { TextField } from "@keybr/widget";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { EXAMPLE } from "./example.ts";
import { TextStatsWidget } from "./TextStatsWidget.tsx";
import * as styles from "./WordCountApp.module.less";

export function WordCountApp(): ReactNode {
  const { formatMessage } = useIntl();
  const initialText = useInitialText();
  const [text, setText] = useState(initialText);
  const textStats = useTextStats(text);
  return (
    <div>
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
      <TextStatsWidget textStats={textStats} />
    </div>
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

function useTextStats(text: string): TextStats {
  const [textStats, setTextStats] = useState(textStatsOf(text));
  useEffect(() => {
    if (text === "") {
      setTextStats(textStatsOf(text));
    }
    const id = setTimeout(() => {
      setTextStats(textStatsOf(text));
    }, 200);
    return () => {
      clearTimeout(id);
    };
  }, [text]);
  return textStats;
}
