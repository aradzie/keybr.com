import { wordListStats } from "@keybr/content-words";
import { useIntlNumbers } from "@keybr/intl";
import { lessonProps, type WordListLesson } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  Field,
  FieldList,
  FieldSet,
  NameValue,
  Para,
  Range,
  styleSizeFull,
  styleSizeWide,
  TextField,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { LessonLengthProp } from "./LessonLengthProp.tsx";
import { TargetSpeedProp } from "./TargetSpeedProp.tsx";

export function WordListLessonSettings({
  lesson,
}: {
  readonly lesson: WordListLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
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
        <WordListPreview lesson={lesson} />
        <WordListStats lesson={lesson} />
        <TargetSpeedProp />
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
  );
}
