import { useSettings } from "@keybr/settings";
import { toTextDisplaySettings } from "@keybr/textinput";
import { Field, FieldList, FieldSet, Para, RadioBox } from "@keybr/widget";
import { type ReactNode } from "react";
import { TextSourceType, typingTestProps } from "../../settings.ts";
import { BookSettings } from "./text/BookSettings.tsx";
import { CommonWordsSettings } from "./text/CommonWordsSettings.tsx";
import { PseudoWordsSettings } from "./text/PseudoWordsSettings.tsx";
import { TextPreview } from "./text/TextPreview.tsx";

export function TextGeneratorSettings(): ReactNode {
  const { settings, updateSettings } = useSettings();
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
              checked={
                settings.get(typingTestProps.type) ===
                TextSourceType.CommonWords
              }
              onSelect={() => {
                updateSettings(
                  settings.set(
                    typingTestProps.type,
                    TextSourceType.CommonWords,
                  ),
                );
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Pseudo words"
              name="text-source"
              value="text-source-pseudo-words"
              checked={
                settings.get(typingTestProps.type) ===
                TextSourceType.PseudoWords
              }
              onSelect={() => {
                updateSettings(
                  settings.set(
                    typingTestProps.type,
                    TextSourceType.PseudoWords,
                  ),
                );
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Book paragraphs"
              name="text-source"
              value="text-source-book"
              checked={
                settings.get(typingTestProps.type) === TextSourceType.Book
              }
              onSelect={() => {
                updateSettings(
                  settings.set(typingTestProps.type, TextSourceType.Book),
                );
              }}
            />
          </Field>
        </FieldList>
      </FieldSet>

      {settings.get(typingTestProps.type) === TextSourceType.CommonWords && (
        <CommonWordsSettings />
      )}
      {settings.get(typingTestProps.type) === TextSourceType.PseudoWords && (
        <PseudoWordsSettings />
      )}
      {settings.get(typingTestProps.type) === TextSourceType.Book && (
        <BookSettings />
      )}

      {false && (
        <FieldSet legend="Preview">
          <TextPreview
            settings={toTextDisplaySettings(settings)}
            textGenerator={null!}
          />
        </FieldSet>
      )}
    </>
  );
}
