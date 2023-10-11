import { useIntlNumbers } from "@keybr/intl";
import { type CustomTextLesson, lessonProps } from "@keybr/lesson";
import { textStatsOf } from "@keybr/plaintext";
import { useSettings } from "@keybr/settings";
import {
  CheckBox,
  Explainer,
  Field,
  FieldList,
  FieldSet,
  NameValue,
  Para,
  styleSizeFull,
  TextField,
} from "@keybr/widget";
import React, { type ReactNode, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { exampleTexts } from "./example-texts.ts";
import { LessonLengthProp } from "./LessonLengthProp.tsx";
import { TargetSpeedProp } from "./TargetSpeedProp.tsx";

export function CustomTextLessonSettings({
  lesson,
}: {
  readonly lesson: CustomTextLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <>
      <Explainer>
        <FormattedMessage
          id="lessonType.customText.description"
          description="Description text."
          defaultMessage="Generate typing lessons from the words of your own custom text. All keys are included by default. This mode is for the pros."
        />
      </Explainer>
      <FieldSet
        legend={formatMessage({
          id: "settings.lessonOptionsLegend",
          description: "Fieldset legend.",
          defaultMessage: "Lesson Options",
        })}
      >
        <CustomTextInput />
        <CustomTextStats />
        <CustomTextProcessing />
        <TargetSpeedProp />
        <LessonLengthProp />
      </FieldSet>
    </>
  );
}

function CustomTextInput(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <Para>
        <FormattedMessage
          id="settings.customTextExamplesLabel"
          description="Input field label."
          defaultMessage="Examples:"
        />{" "}
        {exampleTexts.map(({ title, content }, index) => (
          <span key={index}>
            {index > 0 ? ", " : null}
            <a
              href="#"
              onClick={(ev) => {
                ev.preventDefault();
                updateSettings(
                  settings.set(lessonProps.customText.content, content),
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
          value={settings.get(lessonProps.customText.content)}
          type="textarea"
          placeholder={formatMessage({
            id: "settings.customTextInputPlaceholder",
            description: "Input field placeholder.",
            defaultMessage: "Custom text...",
          })}
          onChange={(value) => {
            updateSettings(settings.set(lessonProps.customText.content, value));
          }}
        />
      </Para>
    </>
  );
}

function CustomTextStats(): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const { settings } = useSettings();
  const customText = settings.get(lessonProps.customText.content);
  const { numWords, numUniqueWords, avgWordLength } = useMemo(
    () => textStatsOf(customText),
    [customText],
  );
  return (
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
  );
}

function CustomTextProcessing(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field>
        <CheckBox
          checked={settings.get(lessonProps.customText.lettersOnly)}
          label={formatMessage({
            id: "settings.customTextLettersOnlyLabel",
            description: "Input field label.",
            defaultMessage: "Remove punctuation",
          })}
          title={formatMessage({
            id: "settings.customTextLettersOnlyTitle",
            description: "Input field title.",
            defaultMessage:
              "Remove punctuation from the text to make it simpler to type.",
          })}
          onChange={(value) => {
            updateSettings(
              settings.set(lessonProps.customText.lettersOnly, value),
            );
          }}
        />
      </Field>
      <Field>
        <CheckBox
          checked={settings.get(lessonProps.customText.lowercase)}
          label={formatMessage({
            id: "settings.customTextLowercaseLabel",
            description: "Input field label.",
            defaultMessage: "Transform to lowercase",
          })}
          title={formatMessage({
            id: "settings.customTextLowercaseTitle",
            description: "Input field title.",
            defaultMessage:
              "Transform all text to lower case to make it simpler to type.",
          })}
          onChange={(value) => {
            updateSettings(
              settings.set(lessonProps.customText.lowercase, value),
            );
          }}
        />
      </Field>
      <Field>
        <CheckBox
          checked={settings.get(lessonProps.customText.randomize)}
          label={formatMessage({
            id: "settings.customTextRandomizeLabel",
            description: "Input field label.",
            defaultMessage: "Shuffle words",
          })}
          title={formatMessage({
            id: "settings.customTextRandomizeTitle",
            description: "Input field title.",
            defaultMessage: "Put words from the custom text in a random order.",
          })}
          onChange={(value) => {
            updateSettings(
              settings.set(lessonProps.customText.randomize, value),
            );
          }}
        />
      </Field>
    </FieldList>
  );
}
