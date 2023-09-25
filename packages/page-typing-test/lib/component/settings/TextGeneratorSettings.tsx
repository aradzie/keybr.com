import { Book } from "@keybr/content-books";
import { Language } from "@keybr/layout";
import { Field, FieldList, FieldSet, Para, RadioBox } from "@keybr/widget";
import { type ReactNode } from "react";
import { BookSettings } from "./text/BookSettings.tsx";
import { CommonWordsSettings } from "./text/CommonWordsSettings.tsx";
import { PseudoWordsSettings } from "./text/PseudoWordsSettings.tsx";
import { TextPreview } from "./text/TextPreview.tsx";
import { type SettingsEditorProps } from "./types.ts";

export function TextGeneratorSettings({
  settings,
  patchSettings,
}: SettingsEditorProps): ReactNode {
  const { textSource } = settings;
  return (
    <>
      <FieldSet legend="Text Settings">
        <Para>Choose what text to type in the test.</Para>

        <FieldList>
          <Field>
            <RadioBox
              label="Common words"
              name="text-source"
              value="text-source-common-words"
              checked={textSource.type === "common-words"}
              onSelect={() => {
                patchSettings({
                  ...settings,
                  textSource: {
                    type: "common-words",
                    language: Language.EN,
                  },
                });
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Pseudo words"
              name="text-source"
              value="text-source-pseudo-words"
              checked={textSource.type === "pseudo-words"}
              onSelect={() => {
                patchSettings({
                  ...settings,
                  textSource: {
                    type: "pseudo-words",
                    language: Language.EN,
                  },
                });
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Book paragraphs"
              name="text-source"
              value="text-source-book"
              checked={textSource.type === "book"}
              onSelect={() => {
                patchSettings({
                  ...settings,
                  textSource: {
                    type: "book",
                    book: Book.EN_ALICE_WONDERLAND,
                    paragraphIndex: 0,
                    capitals: true,
                    punctuators: true,
                  },
                });
              }}
            />
          </Field>
        </FieldList>
      </FieldSet>

      {textSource.type === "common-words" && (
        <CommonWordsSettings
          settings={settings}
          patchSettings={patchSettings}
        />
      )}
      {textSource.type === "pseudo-words" && (
        <PseudoWordsSettings
          settings={settings}
          patchSettings={patchSettings}
        />
      )}
      {textSource.type === "book" && (
        <BookSettings settings={settings} patchSettings={patchSettings} />
      )}

      {false && (
        <FieldSet legend="Preview">
          <TextPreview settings={settings.textDisplay} textGenerator={null!} />
        </FieldSet>
      )}
    </>
  );
}
