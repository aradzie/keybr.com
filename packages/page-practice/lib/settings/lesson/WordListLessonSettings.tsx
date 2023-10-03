import { wordListStats } from "@keybr/content-words";
import { useIntlNumbers } from "@keybr/intl";
import { type WordListLesson } from "@keybr/lesson";
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
              min={10}
              max={1000}
              step={1}
              value={settings.wordListSize}
              title={formatMessage({
                id: "settings.extendLessonLengthTitle",
                description: "Input field title.",
                defaultMessage: "Add more words to every generated lesson.",
              })}
              onChange={(value) => {
                updateSettings(
                  settings.patch({
                    wordListSize: value,
                  }),
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
              id: "settings.targetSpeedLabel",
              description: "Input field label.",
              defaultMessage: "Target typing speed:",
            })}
          </Field>
          <Field>
            <Range
              className={styleSizeWide}
              min={175}
              max={750}
              step={1}
              value={settings.targetSpeed}
              title={formatMessage({
                id: "settings.targetSpeedTitle",
                description: "Input field title.",
                defaultMessage:
                  "Set custom target typing speed that you want to achieve.",
              })}
              onChange={(value) => {
                updateSettings(
                  settings.patch({
                    targetSpeed: value,
                  }),
                );
              }}
            />
          </Field>
          <Field>
            <Value value={fmt(settings.targetSpeed, { unit: true })} />
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
