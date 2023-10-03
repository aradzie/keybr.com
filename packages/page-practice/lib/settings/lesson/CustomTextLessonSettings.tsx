import { useIntlNumbers } from "@keybr/intl";
import { type CustomTextLesson } from "@keybr/lesson";
import { useFormatter } from "@keybr/lesson-ui";
import { textStatsOf } from "@keybr/plaintext";
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
import { type ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";
import { EXAMPLE_TEXT } from "./example.ts";

export function CustomTextLessonSettings({
  lesson,
}: {
  readonly lesson: CustomTextLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const fmt = useFormatter();
  const { settings, updateSettings } = useSettings();
  const { numWords, numUniqueWords, avgWordLength } = useMemo(
    () => textStatsOf(settings.textContent),
    [settings],
  );

  return (
    <>
      <Para>
        {formatMessage({
          id: "lessonType.customText.description",
          description: "Description text.",
          defaultMessage:
            "Generate typing lessons from the words of your own custom text. All keys are included by default. This mode is for the pros.",
        })}
      </Para>

      <FieldSet
        legend={formatMessage({
          id: "settings.lessonOptionsLegend",
          description: "Fieldset legend.",
          defaultMessage: "Lesson Options",
        })}
      >
        <Para>
          {formatMessage({
            id: "settings.customTextExamplesLabel",
            description: "Text label.",
            defaultMessage: "Examples:",
          })}{" "}
          {EXAMPLE_TEXT.map(({ title, content }, index) => (
            <span key={index}>
              {index > 0 ? ", " : null}
              <a
                href="#"
                onClick={(ev) => {
                  ev.preventDefault();
                  updateSettings(
                    settings.patch({
                      textContent: content,
                    }),
                  );
                }}
              >
                {title}
              </a>
            </span>
          ))}
        </Para>

        <Para>
          <TextField
            className={styleSizeFull}
            value={settings.textContent}
            type="textarea"
            placeholder={formatMessage({
              id: "settings.customTextInputPlaceholder",
              description: "Input field placeholder.",
              defaultMessage: "Custom text...",
            })}
            onChange={(value) => {
              updateSettings(
                settings.patch({
                  textContent: value.substring(0, 10_000),
                }),
              );
            }}
          />
        </Para>

        <FieldList>
          <Field>
            <NameValue
              name={formatMessage({
                id: "textStats.allWordCount",
                description: "Text label.",
                defaultMessage: "All words",
              })}
              value={formatNumber(numWords)}
            />
          </Field>
          <Field>
            <NameValue
              name={formatMessage({
                id: "textStats.uniqueWordCount",
                description: "Text label.",
                defaultMessage: "Unique words",
              })}
              value={formatNumber(numUniqueWords)}
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
              checked={settings.textSimplify}
              label={formatMessage({
                id: "settings.removePunctuationLabel",
                description: "Checkbox label.",
                defaultMessage: "Remove punctuation",
              })}
              title={formatMessage({
                id: "settings.removePunctuationTitle",
                description: "Checkbox title.",
                defaultMessage:
                  "Remove punctuation from the text to make it simpler to type.",
              })}
              onChange={(value) => {
                updateSettings(
                  settings.patch({
                    textSimplify: value,
                  }),
                );
              }}
            />
          </Field>
          <Field>
            <CheckBox
              checked={settings.textLowercase}
              label={formatMessage({
                id: "settings.transformToLowercaseLabel",
                description: "Checkbox label.",
                defaultMessage: "Transform to lowercase",
              })}
              title={formatMessage({
                id: "settings.transformToLowercaseTitle",
                description: "Checkbox title.",
                defaultMessage:
                  "Transform all text to lower case to make it simpler to type.",
              })}
              onChange={(value) => {
                updateSettings(
                  settings.patch({
                    textLowercase: value,
                  }),
                );
              }}
            />
          </Field>
          <Field>
            <CheckBox
              checked={settings.textRandomize}
              label={formatMessage({
                id: "settings.shuffleWordsLabel",
                description: "Checkbox label.",
                defaultMessage: "Shuffle words",
              })}
              title={formatMessage({
                id: "settings.shuffleWordsTitle",
                description: "Checkbox title.",
                defaultMessage:
                  "Put words from the custom text in a random order.",
              })}
              onChange={(value) => {
                updateSettings(
                  settings.patch({
                    textRandomize: value,
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
              defaultMessage: "Target speed:",
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
