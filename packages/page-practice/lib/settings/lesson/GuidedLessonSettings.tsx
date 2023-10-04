import { type GuidedLesson, lessonProps } from "@keybr/lesson";
import { useFormatter } from "@keybr/lesson-ui";
import { useSettings } from "@keybr/settings";
import {
  CheckBox,
  Field,
  FieldList,
  FieldSet,
  Para,
  Range,
  styleSizeWide,
  Value,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function GuidedLessonSettings({
  lesson,
}: {
  readonly lesson: GuidedLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  const fmt = useFormatter();
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
              value={Math.round(
                settings.get(lessonProps.guided.alphabetSize) * 100,
              )}
              title={formatMessage({
                id: "settings.extendKeySetTitle",
                description: "Input field title.",
                defaultMessage: "Add more letters to every generated word.",
              })}
              onChange={(value) => {
                updateSettings(
                  settings.set(lessonProps.guided.alphabetSize, value / 100),
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
                defaultMessage: "Add capital letters to the generated text.",
              })}
              checked={settings.get(lessonProps.capitals)}
              onChange={(value) => {
                updateSettings(settings.set(lessonProps.capitals, value));
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
              checked={settings.get(lessonProps.punctuators)}
              onChange={(value) => {
                updateSettings(settings.set(lessonProps.punctuators, value));
              }}
            />
          </Field>
        </FieldList>

        <FieldList>
          <Field>
            {formatMessage({
              id: "settings.targetSpeedLabel",
              description: "Input field label.",
              defaultMessage: "Target typing speed:",
            })}
          </Field>
          <Field>
            <Range
              className={styleSizeWide}
              min={lessonProps.targetSpeed.min}
              max={lessonProps.targetSpeed.max}
              step={1}
              value={settings.get(lessonProps.targetSpeed)}
              title={formatMessage({
                id: "settings.targetSpeedTitle",
                description: "Input field title.",
                defaultMessage:
                  "Set custom target typing speed that you want to achieve.",
              })}
              onChange={(value) => {
                updateSettings(settings.set(lessonProps.targetSpeed, value));
              }}
            />
          </Field>
          <Field>
            <Value
              value={fmt(settings.get(lessonProps.targetSpeed), { unit: true })}
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
              value={Math.round(settings.get(lessonProps.length) * 100)}
              title={formatMessage({
                id: "settings.extendLessonLengthTitle",
                description: "Input field title.",
                defaultMessage: "Add more words to every generated lesson.",
              })}
              onChange={(value) => {
                updateSettings(settings.set(lessonProps.length, value / 100));
              }}
            />
          </Field>
        </FieldList>
      </FieldSet>
    </>
  );
}
