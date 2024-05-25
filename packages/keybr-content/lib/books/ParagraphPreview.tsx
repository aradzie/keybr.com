import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import * as styles from "./ParagraphPreview.module.less";

export const ParagraphPreview = memo(function ParagraphPreview({
  paragraphs,
  paragraphIndex,
  around = 2,
}: {
  readonly paragraphs: readonly string[];
  readonly paragraphIndex: number;
  readonly around?: number;
}): ReactNode {
  const { length } = paragraphs;
  const begin = Math.max(0, paragraphIndex - around);
  const end = Math.min(length - 1, paragraphIndex + around);
  const items = paragraphs
    .slice(begin, end + 1)
    .map((paragraph, index) => [begin + index, paragraph] as [number, string]);
  return (
    <div className={styles.root}>
      {items.map(([index, paragraph]) => (
        <div
          key={index}
          className={clsx(
            styles.item,
            index === paragraphIndex
              ? styles.item_active
              : styles.item_inactive,
          )}
        >
          <ParagraphIndex paragraphIndex={index} />
          <span className={styles.separator}>
            {index === paragraphIndex ? "\u27A4" : " "}
          </span>
          <ParagraphContent paragraph={paragraph} />
        </div>
      ))}
    </div>
  );
});

export function ParagraphIndex({
  paragraphIndex,
}: {
  readonly paragraphIndex: number;
}) {
  return <span className={styles.index}>#{paragraphIndex + 1}</span>;
}

export function ParagraphContent({
  paragraph,
}: {
  readonly paragraph: string;
}) {
  return <span className={styles.content}>{paragraph}</span>;
}
