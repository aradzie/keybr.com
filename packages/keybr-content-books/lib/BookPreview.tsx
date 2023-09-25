import { useIntlNumbers } from "@keybr/intl";
import { textStatsOf } from "@keybr/plaintext";
import { memo, type ReactNode, useMemo } from "react";
import * as styles from "./BookPreview.module.less";
import { type BookContent } from "./types.ts";
import { flattenContent } from "./util.ts";

export const BookPreview = memo(function BookPreview({
  book,
  content,
}: BookContent): ReactNode {
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
    const textStats = textStatsOf(paragraphs);
    return {
      numChapters,
      numParagraphs,
      ...textStats,
    };
  }, [content]);
  return (
    <div className={styles.bookPreview}>
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
          {formatNumber(numChapters)} chapters{" / "}
          {formatNumber(numParagraphs)} paragraphs{" / "}
          {formatNumber(numWords)} words{" / "}
          {formatNumber(numUniqueWords)} unique words{" / "}
          {formatNumber(numCharacters)} characters
        </p>
        <p>Average word length: {formatNumber(avgWordLength, 2)}</p>
      </div>
    </div>
  );
});
