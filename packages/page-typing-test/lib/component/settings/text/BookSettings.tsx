import {
  Book,
  type BookContent,
  BookContentLoader,
  BookPreview,
  flattenContent,
} from "@keybr/content-books";
import { useSettings } from "@keybr/settings";
import {
  Field,
  FieldList,
  FieldSet,
  Icon,
  IconButton,
  OptionList,
  Para,
  Range,
  styleWidth24,
  styleWidth32,
} from "@keybr/widget";
import { mdiSkipNext, mdiSkipPrevious } from "@mdi/js";
import { type ReactNode, useMemo } from "react";
import { typingTestProps } from "../../../settings.ts";
import { ParagraphIndex, ParagraphPreview } from "./ParagraphPreview.tsx";

export function BookSettings(): ReactNode {
  const { settings } = useSettings();
  return (
    <BookContentLoader book={settings.get(typingTestProps.book)}>
      {(bookContent) => <Content bookContent={bookContent} />}
    </BookContentLoader>
  );
}

function Content({
  bookContent,
}: {
  readonly bookContent: BookContent;
}): ReactNode {
  const { settings, updateSettings } = useSettings();
  const paragraphs = useMemo(
    () => flattenContent(bookContent.content),
    [bookContent],
  );
  const book = settings.get(typingTestProps.book);
  const paragraphIndex = settings.get(typingTestProps.bookParagraphIndex);
  return (
    <FieldSet legend="Book paragraphs">
      <Para>Type the content of a book.</Para>

      <FieldList>
        <Field>Book:</Field>
        <Field>
          <OptionList
            className={styleWidth24}
            options={Book.ALL.map(({ id, title }) => ({
              value: id,
              name: title,
            }))}
            value={book.id}
            onSelect={(value) => {
              updateSettings(
                settings.set(typingTestProps.book, Book.ALL.get(value)),
              );
            }}
          />
        </Field>
      </FieldList>

      <BookPreview {...bookContent} />

      <FieldList>
        <Field>Paragraph:</Field>
        <Field>
          <ParagraphIndex paragraphIndex={paragraphIndex} />
        </Field>
        <Field>
          <Range
            className={styleWidth32}
            min={0}
            max={paragraphs.length - 1}
            step={1}
            value={paragraphIndex}
            onChange={(value) => {
              updateSettings(
                settings.set(typingTestProps.bookParagraphIndex, value),
              );
            }}
          />
        </Field>
        <Field>
          <IconButton
            title="Previous paragraph."
            icon={<Icon shape={mdiSkipPrevious} />}
            onClick={() => {
              if (paragraphIndex > 0) {
                updateSettings(
                  settings.set(
                    typingTestProps.bookParagraphIndex,
                    paragraphIndex - 1,
                  ),
                );
              }
            }}
          />
          <IconButton
            title="Next paragraph."
            icon={<Icon shape={mdiSkipNext} />}
            onClick={() => {
              if (paragraphIndex < paragraphs.length - 1) {
                updateSettings(
                  settings.set(
                    typingTestProps.bookParagraphIndex,
                    paragraphIndex + 1,
                  ),
                );
              }
            }}
          />
        </Field>
      </FieldList>

      <ParagraphPreview
        paragraphs={paragraphs}
        paragraphIndex={paragraphIndex}
      />
    </FieldSet>
  );
}
