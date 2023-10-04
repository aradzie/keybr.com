import { wordListStats } from "@keybr/content-words";
import { useIntlNumbers } from "@keybr/intl";
import { lessonProps, type WordListLesson } from "@keybr/lesson";
import { useFormatter } from "@keybr/lesson-ui";
import { useSettings } from "@keybr/settings";
import {
  CheckBox,
  Field,
  FieldList,
  FieldSet,
  NameValue,
  Para,
  Range,
  styleSizeFull,
  styleSizeWide,
  TextField,
  Value,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function WordListLessonSettings({
  lesson,
}: {
  readonly lesson: WordListLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const fmt = useFormatter();
  const { settings, updateSettings } = useSettings();
  const { wordCount, avgWordLength } = wordListStats(lesson.wordList);

  return (
    <>
      <Para>
        {formatMessage({
          id: "lessonType.wordList.description",
          description: "Description text.",
          defaultMessage:
            "Generate typing lessons from the list of the most common words of your language. All keys are included by default. This mode is for the pros.",
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
              id: "settings.wordListSizeLabel",
              description: "Input field label.",
              defaultMessage: "Word list size:",
            })}
          </Field>
          <Field>
            <Range
              className={styleSizeWide}
              min={lessonProps.wordList.wordListSize.min}
              max={lessonProps.wordList.wordListSize.max}
              step={1}
              value={settings.get(lessonProps.wordList.wordListSize)}
              title={formatMessage({
                id: "settings.wordListSizeTitle",
                description: "Input field title.",
                defaultMessage: "Chose how many common words to use.",
              })}
              onChange={(value) => {
                updateSettings(
                  settings.set(lessonProps.wordList.wordListSize, value),
                );
              }}
            />
          </Field>
        </FieldList>

        <Para>
          <TextField
            className={styleSizeFull}
            type="textarea"
            value={[...lesson.wordList].join(", ")}
            disabled={true}
          />
        </Para>

        <FieldList>
          <Field>
            <NameValue
              name={formatMessage({
                id: "textStats.uniqueWordCount",
                description: "Text label.",
                defaultMessage: "Unique words",
              })}
              value={formatNumber(wordCount)}
            />
          </Field>
          <Field>
            <NameValue
              name={formatMessage({
                id: "textStats.averageWordLength",
                description: "Text label.",
                defaultMessage: "Average word length",
              })}
              value={formatNumber(avgWordLength, 2)}
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
