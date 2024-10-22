import { wordListStats } from "@keybr/content";
import { useIntlNumbers } from "@keybr/intl";
import { lessonProps, type WordListLesson } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  CheckBox,
  Description,
  Explainer,
  Field,
  FieldList,
  FieldSet,
  NameValue,
  Para,
  Range,
  TextField,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { LessonLengthProp } from "./LessonLengthProp.tsx";
import { RepeatWordsProp } from "./RepeatWordsProp.tsx";
import { TargetSpeedProp } from "./TargetSpeedProp.tsx";
import { TextManglingProp } from "./TextManglingProp.tsx";

export function WordListLessonSettings({
  lesson,
}: {
  readonly lesson: WordListLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <>
      <Explainer>
        <Description>
          <FormattedMessage
            id="lessonType.wordList.description"
            defaultMessage="Generate typing lessons from the list of the most common words of your language. All keys are included by default. This mode is for the pros."
          />
        </Description>
      </Explainer>
      <FieldSet
        legend={formatMessage({
          id: "settings.lessonOptions.legend",
          defaultMessage: "Lesson Options",
        })}
      >
        <WordListPreview lesson={lesson} />
        <WordListStats lesson={lesson} />
        <TargetSpeedProp />
        <RepeatWordsProp />
        <TextManglingProp />
        <LessonLengthProp />
      </FieldSet>
    </>
  );
}

function WordListPreview({
  lesson,
}: {
  readonly lesson: WordListLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.wordListSize.label"
            defaultMessage="Word list size:"
          />
        </Field>
        <Field>
          <Range
            size={16}
            min={lessonProps.wordList.wordListSize.min}
            max={lessonProps.wordList.wordListSize.max}
            step={1}
            value={settings.get(lessonProps.wordList.wordListSize)}
            onChange={(value) => {
              updateSettings(
                settings.set(lessonProps.wordList.wordListSize, value),
              );
            }}
          />
        </Field>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "settings.longWordsOnly.label",
              defaultMessage: "Long words only",
            })}
            checked={settings.get(lessonProps.wordList.longWordsOnly)}
            onChange={(value) => {
              updateSettings(
                settings.set(lessonProps.wordList.longWordsOnly, value),
              );
            }}
          />
        </Field>
      </FieldList>
      <Para>
        <TextField
          size="full"
          type="textarea"
          value={[...lesson.wordList].join(", ")}
          disabled={true}
        />
      </Para>
    </>
  );
}

function WordListStats({
  lesson,
}: {
  readonly lesson: WordListLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const { wordCount, avgWordLength } = wordListStats(lesson.wordList);
  return (
    <FieldList>
      <Field>
        <NameValue
          name={formatMessage({
            id: "textStats.numUniqueWords",
            defaultMessage: "Unique words",
          })}
          value={formatNumber(wordCount)}
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
