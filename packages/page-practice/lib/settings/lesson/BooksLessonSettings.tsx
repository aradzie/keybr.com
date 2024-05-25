import {
  BookPreview,
  BookSelector,
  ParagraphPreview,
  ParagraphSelector,
} from "@keybr/content";
import { type BooksLesson, lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import { Explainer, FieldSet } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function BooksLessonSettings({
  lesson,
}: {
  readonly lesson: BooksLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  const { book, content, paragraphs, paragraphIndex } = lesson;
  return (
    <>
      <Explainer>
        <FormattedMessage
          id="lessonType.books.description"
          defaultMessage="Generate typing lessons from the text of a book. All keys are included by default. This mode is for the pros."
        />
      </Explainer>

      <FieldSet
        legend={formatMessage({
          id: "settings.lessonOptions.legend",
          defaultMessage: "Lesson Options",
        })}
      >
        <BookSelector
          book={book}
          onChange={(book) => {
            updateSettings(
              settings
                .set(lessonProps.books.book, book)
                .set(lessonProps.books.paragraphIndex, 0),
            );
          }}
        />

        <BookPreview book={book} content={content} />

        <ParagraphSelector
          paragraphs={paragraphs}
          paragraphIndex={paragraphIndex}
          onChange={(paragraphIndex) => {
            updateSettings(
              settings.set(lessonProps.books.paragraphIndex, paragraphIndex),
            );
          }}
        />

        <ParagraphPreview
          paragraphs={paragraphs}
          paragraphIndex={paragraphIndex}
        />
      </FieldSet>
    </>
  );
}
