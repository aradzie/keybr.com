import { useIntlNumbers } from "@keybr/intl";
import { type Language } from "@keybr/keyboard";
import { type CustomTextLesson, lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import { textStatsOf } from "@keybr/unicode";
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
  const { settings } = useSettings();
  return (
    <>
      <Explainer>
        <FormattedMessage
          id="lessonType.customText.description"
          defaultMessage="Generate typing lessons from the words of your own custom text. All keys are included by default. This mode is for the pros."
        />
      </Explainer>
      <FieldSet
        legend={formatMessage({
          id: "settings.lessonOptions.legend",
          defaultMessage: "Lesson Options",
        })}
      >
        <CustomTextInput />
        <CustomTextStats
          language={lesson.model.language}
          customText={settings.get(lessonProps.customText.content)}
        />
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
          id="settings.customTextExamples.label"
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
            id: "settings.customTextInput.placeholder",
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

function CustomTextStats({
  language,
  customText,
}: {
  readonly language: Language;
  readonly customText: string;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const { numWords, numUniqueWords, avgWordLength } = useMemo(
    () => textStatsOf(language.locale, customText),
    [language, customText],
  );
  return (
    <FieldList>
      <Field>
        <NameValue
          name={formatMessage({
            id: "textStats.numAllWords",
            defaultMessage: "All words",
          })}
          value={formatNumber(numWords)}
        />
      </Field>
      <Field>
        <NameValue
          name={formatMessage({
            id: "textStats.numUniqueWords",
            defaultMessage: "Unique words",
          })}
          value={formatNumber(numUniqueWords)}
        />
      </Field>
      <Field>
        <NameValue
          name={formatMessage({
            id: "textStats.averageWordLength",
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
            id: "settings.customTextLettersOnly.label",
            defaultMessage: "Remove punctuation",
          })}
          title={formatMessage({
            id: "settings.customTextLettersOnly.description",
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
            id: "settings.customTextLowercase.label",
            defaultMessage: "Transform to lowercase",
          })}
          title={formatMessage({
            id: "settings.customTextLowercase.description",
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
            id: "settings.customTextRandomize.label",
            defaultMessage: "Shuffle words",
          })}
          title={formatMessage({
            id: "settings.customTextRandomize.description",
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
