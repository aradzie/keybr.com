import { type GuidedLesson } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  CheckBox,
  Field,
  FieldList,
  FieldSet,
  Para,
  Range,
  styleSizeWide,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function GuidedLessonSettings({
  lesson,
}: {
  readonly lesson: GuidedLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();

  return (
    <>
      <Para>
        {formatMessage({
          id: "lessonType.guided.description",
          description: "Description text.",
          defaultMessage:
            "Generate typing lessons with random words using the phonetic rules of your language. The key set is expanded dynamically based on your performance. This mode is for the beginners.",
        })}
      </Para>

      <FieldSet
        legend={formatMessage({
          id: "settings.lessonOptionsLegend",
          description: "Fieldset legend.",
          defaultMessage: "Lesson Options",
        })}
      >
        <FieldList>
          <Field>
            {formatMessage({
              id: "settings.extendKeySetLabel",
              description: "Input field label.",
              defaultMessage: "Add letters to words:",
            })}
          </Field>
          <Field>
            <Range
              className={styleSizeWide}
              min={1}
              max={100}
              step={1}
              value={Math.round(settings.lessonComplexity * 100)}
              title={formatMessage({
                id: "settings.extendKeySetTitle",
                description: "Input field title.",
                defaultMessage: "Add more letters to every generated word.",
              })}
              onChange={(value) => {
                updateSettings(
                  settings.patch({
                    lessonComplexity: value / 100,
                  }),
                );
              }}
            />
          </Field>
        </FieldList>

        <FieldList>
          <Field>
            <CheckBox
              label={formatMessage({
                id: "settings.enableCapitalLettersLabel",
                description: "Checkbox label.",
                defaultMessage: "Enable capital letters",
              })}
              title={formatMessage({
                id: "settings.enableCapitalLettersTitle",
                description: "Checkbox title.",
                defaultMessage: "Generate text with capital letters.",
              })}
              checked={settings.lessonCapitals}
              onChange={(value) => {
                updateSettings(
                  settings.patch({
                    lessonCapitals: value,
                  }),
                );
              }}
            />
          </Field>
          <Field>
            <CheckBox
              label={formatMessage({
                id: "settings.enablePunctuationLabel",
                description: "Checkbox label.",
                defaultMessage: "Enable punctuation characters",
              })}
              title={formatMessage({
                id: "settings.enablePunctuationTitle",
                description: "Checkbox title.",
                defaultMessage:
                  "Add punctuation characters to the generated text.",
              })}
              checked={settings.lessonPunctuators}
              onChange={(value) => {
                updateSettings(
                  settings.patch({
                    lessonPunctuators: value,
                  }),
                );
              }}
            />
          </Field>
        </FieldList>

        <FieldList>
          <Field>
            {formatMessage({
              id: "settings.extendLessonLengthLabel",
              description: "Input field label.",
              defaultMessage: "Add words to lessons:",
            })}
          </Field>
          <Field>
            <Range
              className={styleSizeWide}
              min={1}
              max={100}
              step={1}
              value={Math.round(settings.lessonLength * 100)}
              title={formatMessage({
                id: "settings.extendLessonLengthTitle",
                description: "Input field title.",
                defaultMessage: "Add more words to every generated lesson.",
              })}
              onChange={(value) => {
                updateSettings(
                  settings.patch({
                    lessonLength: value / 100,
                  }),
                );
              }}
            />
          </Field>
        </FieldList>
      </FieldSet>
    </>
  );
}
