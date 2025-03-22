import { useIntlNumbers } from "@keybr/intl";
import { textStatsOf } from "@keybr/unicode";
import { NameValue } from "@keybr/widget";
import { memo, type ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";
import * as styles from "./BookPreview.module.less";
import { type BookContent } from "./types.ts";
import { flattenContent } from "./util.ts";

export const BookPreview = memo(function BookPreview({
  book,
  content,
}: BookContent): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const {
    numChapters,
    numParagraphs,
    numWords,
    numUniqueWords,
    numCharacters,
    avgWordLength,
  } = useMemo(() => {
    const paragraphs = flattenContent(content);
    const numChapters = content.length;
    const numParagraphs = paragraphs.length;
    const textStats = textStatsOf(book.language.locale, paragraphs);
    return {
      numChapters,
      numParagraphs,
      ...textStats,
    };
  }, [book, content]);
  return (
    <div className={styles.root}>
      <img
        className={styles.coverImage}
        src={book.coverImage}
        alt="Book cover image"
        title={`${book.title} by ${book.author}`}
      />
      <div className={styles.details}>
        <p>
          <strong>{book.title}</strong> by <strong>{book.author}</strong>
        </p>
        <p>
          <NameValue
            name={formatMessage({
              id: "t_num_Chapters",
              defaultMessage: "Chapters",
            })}
            value={formatNumber(numChapters)}
          />
          <NameValue
            name={formatMessage({
              id: "t_num_Paragraphs",
              defaultMessage: "Paragraphs",
            })}
            value={formatNumber(numParagraphs)}
          />
          <NameValue
            name={formatMessage({
              id: "t_num_All_words",
              defaultMessage: "All words",
            })}
            value={formatNumber(numWords)}
          />
          <NameValue
            name={formatMessage({
              id: "t_num_Unique_words",
              defaultMessage: "Unique words",
            })}
            value={formatNumber(numUniqueWords)}
          />
          <NameValue
            name={formatMessage({
              id: "t_num_Characters",
              defaultMessage: "Characters",
            })}
            value={formatNumber(numCharacters)}
          />
        </p>
        <p>
          <NameValue
            name={formatMessage({
              id: "t_Average_word_length",
              defaultMessage: "Average word length",
            })}
            value={formatNumber(avgWordLength, 2)}
          />
        </p>
      </div>
    </div>
  );
});
