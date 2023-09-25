import {
  Book,
  type BookContent,
  BookContentLoader,
  BookPreview,
  flattenContent,
} from "@keybr/content-books";
import {
  CheckBox,
  Field,
  FieldList,
  FieldSet,
  Icon,
  IconButton,
  OptionList,
  Para,
  Range,
  styleSizeExtraExtraWide,
  styleSizeExtraWide,
} from "@keybr/widget";
import { mdiSkipNext, mdiSkipPrevious } from "@mdi/js";
import { type ReactNode, useMemo } from "react";
import { type BookSource } from "../../../generator/index.ts";
import { type SettingsEditorProps } from "../types.ts";
import { ParagraphIndex, ParagraphPreview } from "./ParagraphPreview.tsx";

export function BookSettings({
  settings,
  patchSettings,
}: SettingsEditorProps): ReactNode {
  const { textSource } = settings as { readonly textSource: BookSource };
  return (
    <BookContentLoader book={textSource.book}>
      {(bookContent) => (
        <Tab
          settings={settings}
          patchSettings={patchSettings}
          bookContent={bookContent}
        />
      )}
    </BookContentLoader>
  );
}

function Tab({
  settings,
  patchSettings,
  bookContent: { book, content },
}: SettingsEditorProps & { readonly bookContent: BookContent }): ReactNode {
  const { textSource } = settings as { readonly textSource: BookSource };
  const paragraphs = useMemo(() => flattenContent(content), [content]);
  return (
    <FieldSet legend="Book paragraphs">
      <Para>Type the content of a book.</Para>

      <FieldList>
        <Field>Book:</Field>
        <Field>
          <OptionList
            className={styleSizeExtraWide}
            options={Book.ALL.map(({ id, title }) => ({
              value: id,
              name: title,
            }))}
            value={textSource.book.id}
            onSelect={(value) => {
              patchSettings({
                ...settings,
                textSource: {
                  ...textSource,
                  book: Book.ALL.get(value),
                  paragraphIndex: 0,
                },
              });
            }}
          />
        </Field>
      </FieldList>

      <BookPreview book={book} content={content} />

      <FieldList>
        <Field>Paragraph:</Field>
        <Field>
          <ParagraphIndex paragraphIndex={textSource.paragraphIndex} />
        </Field>
        <Field>
          <Range
            className={styleSizeExtraExtraWide}
            min={0}
            max={paragraphs.length - 1}
            step={1}
            value={textSource.paragraphIndex}
            onChange={(value) => {
              patchSettings({
                ...settings,
                textSource: {
                  ...textSource,
                  paragraphIndex: value,
                },
              });
            }}
          />
        </Field>
        <Field>
          <IconButton
            title="Previous paragraph."
            icon={<Icon shape={mdiSkipPrevious} />}
            onClick={() => {
              if (textSource.paragraphIndex > 0) {
                patchSettings({
                  ...settings,
                  textSource: {
                    ...textSource,
                    paragraphIndex: textSource.paragraphIndex - 1,
                  },
                });
              }
            }}
          />
          <IconButton
            title="Next paragraph."
            icon={<Icon shape={mdiSkipNext} />}
            onClick={() => {
              if (textSource.paragraphIndex < paragraphs.length - 1) {
                patchSettings({
                  ...settings,
                  textSource: {
                    ...textSource,
                    paragraphIndex: textSource.paragraphIndex + 1,
                  },
                });
              }
            }}
          />
        </Field>
      </FieldList>

      <ParagraphPreview
        paragraphs={paragraphs}
        paragraphIndex={textSource.paragraphIndex}
      />

      <FieldList>
        <Field>
          <CheckBox
            label="Allow capital letters"
            checked={textSource.capitals}
            onChange={(checked) => {
              patchSettings({
                ...settings,
                textSource: {
                  ...textSource,
                  capitals: checked,
                },
              });
            }}
            disabled={true}
          />
        </Field>
        <Field>
          <CheckBox
            label="Allow punctuation characters"
            checked={textSource.punctuators}
            onChange={(checked) => {
              patchSettings({
                ...settings,
                textSource: {
                  ...textSource,
                  punctuators: checked,
                },
              });
            }}
            disabled={true}
          />
        </Field>
      </FieldList>
    </FieldSet>
  );
}
